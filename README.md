
# Cupify Spicy Sheriffs

MA25 Group Assignment Cupify, a REST API for tournaments, teams and matches. Built with Node.js, AWS Lambda, API Gateway, DynamoDB and the Serverless Framework. 

## API URL
`https://rieshb2h0k.execute-api.eu-north-1.amazonaws.com`

## Installation

```bash
git clone <repo-url>
cd MA25-cupify-spicy-sheriffs
npm install
npm install -g serverless
cp .env.example .env
aws configure
serverless login
```

Open `.env` and fill in: 
- `AWS_ROLE` - the ARN of the Lambda IAM role. 
- `AWS_ORG` - The Serverless org name

## Deploy 
```bash
serverless deploy
```

## Endpoints 
- GET /tournaments
- GET /tournaments/{id}
- POST /tournaments
- PATCH /tournaments/{id}/status
- DELETE /tournaments/{id}

- GET /tournaments/{id}/matches
- GET /tournaments/{id}/matches/{matchId}
- DELETE /tournaments/{id}/matches/{matchId}
- POST /tournaments/{id}/matches
- PUT /tournaments/{id}/matches/{matchId}
- PATCH /tournaments/{id}/matches/{matchId}/result

- GET /tournaments/{id}/teams
- GET /tournaments/{id}/teams/{teamId}
- POST /tournaments/{id}/teams
- PUT /tournaments/{id}/teams/{teamId}
- DELETE /tournaments/{id}/teams/{teamId}

- GET /tournaments/{id}/standings

## Team
Aurelie Vaudan, Mikael Engvall, Ibrahim Jasim Alsalih, Robin Henriksson och Ahmad Alhayel

