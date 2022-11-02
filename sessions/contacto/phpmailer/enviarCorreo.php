<?php

include("class.phpmailer.php");

			$nombres=$_POST['nombres'];
			$cargo=$_POST['cargo'];
			$empresa=$_POST['empresa'];
			$email=$_POST['email'];
			$ciudad=$_POST['ciudad'];
			$pais=$_POST['pais'];
			$telefono=$_POST['telefono'];
			$mensaje=$_POST['mensaje'];

			$body= "Envio De E-mail
			<table width='50%'  border='1' cellpadding='5' cellspacing='1' bgcolor='#CCCCCC'>
			<tr>
				<td bgcolor='#FFFFFF'>nombre completo</td>
				<td bgcolor='#FFFFFF'>".$nombres."</td>
			</tr>
			<tr>
				<td bgcolor='#FFFFFF'>cargo</td>
				<td bgcolor='#FFFFFF'>".$cargo."</td>
			</tr>
			<tr>
				<td bgcolor='#FFFFFF'>empresa</td>
				<td bgcolor='#FFFFFF'>".$empresa."</td>
			</tr>
			<tr>
				<td bgcolor='#FFFFFF'>e-mail</td>
				<td bgcolor='#FFFFFF'>".$email."</td>
			</tr>
			<tr>
				<td bgcolor='#FFFFFF'>pais</td>
				<td bgcolor='#FFFFFF'>".$pais."</td>
			</tr>
			<tr>
				<td bgcolor='#FFFFFF'>ciudad</td>
				<td bgcolor='#FFFFFF'>".$ciudad."</td>
			</tr>   
			<tr>
				<td bgcolor='#FFFFFF'>telefono</td>
				<td bgcolor='#FFFFFF'>".$telefono."</td>
			</tr>
			<tr>
				<td bgcolor='#FFFFFF'>mensaje</td>
				<td bgcolor='#FFFFFF'>".$mensaje."</td>
			</tr>
			</table>";

        $secretKey = "6LepvUMUAAAAABpBQkesyP4ePlik7lRNzUVFYGwv";
        $responseKey = $_POST['g-recaptcha-response'];
        $userIP = $_SERVER['REMOTE_ADDR'];

        $url = "https://www.google.com/recaptcha/api/siteverify?secret=$secretKey&response=$responseKey&remoteip=$userIP";
        $response = file_get_contents($url);
        $response = json_decode($response);
        if ($response->success){
			
		
			$mail = new phpmailer();
			$mail->From     = $email;
			$mail->FromName = "Visitante WEB";
			$mail->Host     = "localhost";
			$mail->Mailer   = "smtp";
			$mail->Subject   = "E-mail Sitio Web Digital Flute";
			$mail->Body    = $body;
			$mail->IsHTML(true);
			$mail->AddAddress("dgflute@gmail.com","frankdrujes@gmail.com");
			$mail->AddCC("frank_drujes@hotmail.com","frankdrujes@gmail.com");
			$mail->AddBCC("frankdrujes@gmail.com","frankdrujes@gmail.com");
			$mail->Send();
			$mail->ClearAddresses();

			
			
            header("Location:gracias.php?envio=ok");
	 		
			
		}else{
			echo "
            <script type=\"text/javascript\">
            	alert('WARNING: ARE YOU HUMAN?');
				location.href='http://www.dgflute.com#contacto';
            </script>
        	";
		}
            

?>
