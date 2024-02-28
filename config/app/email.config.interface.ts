interface EmailAuthInterface {
  user: string;
  pass: string;
}

export interface EmailConfigInterface {
  /*  host: string;
  port: number;*/
  secure: boolean;
  auth: EmailAuthInterface;
}
