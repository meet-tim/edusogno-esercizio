<?php

    class AuthController{
        public function __construct(private AuthRepository $authRepository,private MailService $mailService){
            
        }
        public function processRequest(string $method,string $path): void
        {
            switch ($method) {
                case "POST":
                    if ($path == "login"){
                        $data = (array) json_decode(file_get_contents("php://input"), true);
                        $errors = $this->getValidationErrors($data, false);

                        if ( ! empty($errors)) {
                            http_response_code(400);
                            echo json_encode(["errors" => $errors]);
                            break;
                        }

                        $userData = $this->authRepository->GetUserByEmail($data["email"]);
 
                        if ($userData && password_verify($data["password"], $userData['password'])) {
                            $userData["sessionId"] = session_create_id($userData["id"]);
                            $this->authRepository->UpdateUser($userData);
                            echo json_encode([
                                "sessionId" => $userData["sessionId"],
                                "nome"=>$userData["nome"],
                                "email"=>$userData["email"],
                                "cognome"=>$userData["cognome"],
                                "role"=>$userData["role"]
                            ]);
                        }else{
                            http_response_code(401);
                            echo json_encode([
                                "message" => "Wrong Credentials",
                            ]);
                        }
                    }elseif($path == "register"){
                        $data = (array) json_decode(file_get_contents("php://input"), true);
                        
                        $errors = $this->getValidationErrors($data, true);
                        
                        if ( ! empty($errors)) {
                            http_response_code(400);
                            echo json_encode(["errors" => $errors]);
                            break;
                        }
                        
                        $data["password"] = password_hash($data["password"], PASSWORD_DEFAULT);
                        $this->authRepository->register($data);

                        echo json_encode([
                            "message" => "User Created",
                        ]);
                    }elseif($path == "forgot-password"){
                        $data = (array) json_decode(file_get_contents("php://input"), true);
                        if(!empty($data["email"])){
                            $user = $this->authRepository->GetUserByEmail($data["email"]);
                            if(!empty($user)){
                                $user["sessionId"] = session_create_id($user["id"]);
                                $this->authRepository->UpdateUser($user);
                                $message = "Please reset password with http://localhost:3000/change-password?token={$user["sessionId"]}";
                                $this->mailService->sendMail("Reset password", $message, $user["email"]);
                            }else{
                                http_response_code(404);
                            }                    
                        }
                    }elseif($path == "change-password"){
                        $headers = getallheaders();
                        $sessionId = $headers["Session-Id"];
                        $data = (array) json_decode(file_get_contents("php://input"), true);
                        if(empty($sessionId)){
                            http_response_code(401);
                            return;
                        }   

                        if(!empty($data["password"] || $data["password"] == "")){
                            $user = $this->authRepository->GetUserBySession($sessionId);
                            if(!empty($user)){
                                $user["password"] = password_hash($data["password"], PASSWORD_DEFAULT);
                                $user["sessionId"] = session_create_id($user["id"]);
                                $this->authRepository->UpdateUser($user);
                                echo json_encode([
                                    "message" => "Success",
                                ]);
                            }                            
                        }
                    }
                    break;
                case "DELETE":
                    $user = $this->VerifySession();
                    $user["sessionId"] = "";
                    echo $user["nome"];
                    $this->authRepository->UpdateUser($user);
                    echo json_encode([
                        "message"=>"success"
                    ]);
                    http_response_code(200);
                    break;
                case "GET"://dashboard
                    if($path == "myevents"){
                        $user = $this->VerifySession();
                        $data = $this->authRepository->Dashboard($user["email"]);
                        echo json_encode($data);
                    }
                    break;    
                    
                default:
                http_response_code(405);
                header("Allow: GET,POST");
            }
        }

        private function getValidationErrors(array $data, bool $is_new = true): array
        {
            $errors = [];
            
            if ($is_new && empty($data["nome"])) {
                $errors[] = "nome is required";
            }

            if (empty($data["email"])) {
                $errors[] = "email is required";
            }

            if ($is_new && empty($data["cognome"])) {
                $errors[] = "cognome is required";
            }

            if (empty($data["password"])) {
                $errors[] = "password is required";
            }
            
            return $errors;
        }


        private function VerifySession(){
            $headers = getallheaders();
            $sessionId = $headers["Session-Id"];
            $email=$headers["email"];
            if (!empty($sessionId)){
                $user =  $this->authRepository->GetUserBySession($sessionId);
                if(!empty($user)) {
                    if($email == $user["email"]){
                        return $user;
                    }                      
                }     
            }
            http_response_code(401);
        }

    }