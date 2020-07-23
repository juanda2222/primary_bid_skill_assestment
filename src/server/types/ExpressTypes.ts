

interface secrets {
  db_user: string,
  db_password: string,
  user_id: string
}

interface app{
  locals: {
    secrets: secrets
  }
}


declare namespace Express {
  export interface Request {
    app: app,
    url: string 
    body: {
      url?: string
    }
    params: {
      id?: string
    }
    query: {
      byUser?: "true" | any
    },
    session: {
      user_id?: string,
      id:string
    }
  }
  export interface Response {
    send(one: any): void,
    status(one: number): {
      send(one: any): void
    },
    sendFile(one:string):void
  }
}

export { Express, secrets, app}