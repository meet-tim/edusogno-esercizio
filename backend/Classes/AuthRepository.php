<?php

class AuthRepository{
    private PDO $conn;

    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
    }
    public function GetUserByEmail(string $email): array | false
{
    $sql = "SELECT *
            FROM utenti
            WHERE email = :email";
            
    $stmt = $this->conn->prepare($sql);
    
    $stmt->bindValue(":email", $email, PDO::PARAM_STR);
    
    $stmt->execute();
    
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return $data;
}

public function GetUserBySession(string $sessionId): array | false
{
    $sql = "SELECT *
            FROM utenti
            WHERE sessionId = :sessionId";
            
    $stmt = $this->conn->prepare($sql);
    
    $stmt->bindValue(":sessionId", $sessionId, PDO::PARAM_STR);
    
    $stmt->execute();
    
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    return $data;
}

    public function Register(array $data):string{  
        $sql = "INSERT INTO utenti (nome, cognome, email,password,role)
                VALUES (:nome, :cognome, :email, :password, :role)";
                
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindValue(":nome", $data["nome"], PDO::PARAM_STR);
        $stmt->bindValue(":cognome", $data["cognome"], PDO::PARAM_STR);
        $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
        $stmt->bindValue(":password", $data["password"], PDO::PARAM_STR);
        $stmt->bindValue(":role", "user", PDO::PARAM_STR);
        
        $stmt->execute();
        
        return $this->conn->lastInsertId();
    }

    public function UpdateUser(array $data):int{  
        $sql = "UPDATE utenti 
        SET nome = :nome, cognome = :cognome, email = :email, password = :password, sessionId = :sessionId 
        WHERE id = :id"; 

        $stmt = $this->conn->prepare($sql);

        $stmt->bindValue(":id", $data["id"], PDO::PARAM_INT); 
        $stmt->bindValue(":nome", $data["nome"], PDO::PARAM_STR);
        $stmt->bindValue(":cognome", $data["cognome"], PDO::PARAM_STR);
        $stmt->bindValue(":email", $data["email"], PDO::PARAM_STR);
        $stmt->bindValue(":sessionId", $data["sessionId"], PDO::PARAM_STR);
        $stmt->bindValue(":password", $data["password"], PDO::PARAM_STR);

        $stmt->execute();

        return $stmt->rowCount();

    }

    public function Dashboard(string $email): array | false
{
    $sql = "SELECT *
    FROM eventi
    WHERE FIND_IN_SET(:email, attendees) > 0;";
            
    $stmt = $this->conn->prepare($sql);
    
    $stmt->bindValue(":email", $email, PDO::PARAM_STR);
    
    $stmt->execute();

    $events = [];

    while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $events[] = $row;
    }  

    return $events;
}
}