<?php
use PHPMailer\PHPMailer\PHPMailer;


    class MailService{
        private PHPMailer $mail;
        public function __construct(private PHPMailer $_mail){
            $this->mail = $_mail;
        }
        public function SendMail(string $subject,string $message,string $email): void
        {  
            try {
                $this->mail->SMTPDebug = 2;                                       
                $this->mail->isSMTP();                                            
                $this->mail->Host       = 'smtp.gmail.com;';                    
                $this->mail->SMTPAuth   = true;                             
                $this->mail->Username   = //email here;                 
                $this->mail->Password   = //password here;                        
                $this->mail->SMTPSecure = 'tls';                              
                $this->mail->Port       = 587;  
            
                $this->mail->setFrom('replace with email' , 'Eventi');           
                $this->mail->addAddress($email);
                
                $this->mail->isHTML(true);                                  
                $this->mail->Subject = $subject;
                $this->mail->Body    = $message;
                $this->mail->send();
                echo "Mail has been sent successfully!";
            } catch (Exception $e) {
                echo "Message could not be sent. Mailer Error: {$this->mail->ErrorInfo}";
            }
        
        }
    }