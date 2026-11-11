
# Cupify Spicy Sherrifs

MA25 Group Assignment Cupify, a REST API for tournaments, teams and matches. Built with Node.js, AWS Lambda, API Gateway, DynamoDB and the Serverless Framework. 

## Installation

```bash 
git clone <repo-url>
cd MA25-cupify-spicy-sheriffs
npm install
cp .env.example .env
```

Open `.env` and fill in: 
- `AWS_ROLE` - the ARN of the Lambda IAM role. 
- `AWS_ORG` - The Serverless org name

## Deploy 
```bash
serverless deploy
```

## API URL
`https://rieshb2h0k.execute-api.eu-north-1.amazonaws.com`

## Endpoints 


## Implemented: 
- GET /tournaments
- GET /tournaments/{id}
- POST /tournaments
- PATCH /tournaments/{id}/status
- DELETE /tournaments/{id}

- GET /tournaments/{id}/matches
- GET /tournaments/{id}/matches/{matchId}
- DELETE /tournaments/{id}/matches/{matchId}

## Pending:
- GET /tournaments/{id}/teams
- GET /tournaments/{id}/teams/{teamId}
- POST /tournaments/{id}/teams
- PUT /tournaments/{id}/teams/{teamId}
- DELETE /tournaments/{id}/teams/{teamId}


POST tournaments/{id}/matches
PUT /tournaments/{id}/matches/{matchId}
PATCH /tournaments/{id}/matches/{matchId}/result

Aurelie Vaudan, Mikeal Engvall, Ibrahim Jasim Alsalih, Robin Henriksson och Ahmad Alhayel

