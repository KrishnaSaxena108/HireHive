require('dotenv').config();

const GRAPHQL_URL = 'http://localhost:4000/graphql';

async function fetchGraphQL(query, variables, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST', headers, body: JSON.stringify({ query, variables })
  });
  return res.json();
}

async function run() {
  console.log('Testing review flow');

  // helper to register or login user
  async function ensureUser(username, email, role) {
    const regQ = `
      mutation($username:String!,$email:String!,$password:String!,$role:String!){
        register(username:$username,email:$email,password:$password,role:$role){ token user{id}}
      }
    `;
    const password = 'pass123';
    let json = await fetchGraphQL(regQ, { username, email, password, role });
    if (json.errors) {
      // login instead
      const loginQ = `
        mutation($email:String!,$password:String!){ login(email:$email,password:$password){ token user{id}}
        }
      `;
      json = await fetchGraphQL(loginQ, { email, password });
    }
    const token = json.data.register ? json.data.register.token : json.data.login.token;
    const id = json.data.register ? json.data.register.user.id : json.data.login.user.id;
    return { token, id };
  }

  const client = await ensureUser('client2','client2@example.com','CLIENT');
  const freelancer = await ensureUser('free2','free2@example.com','FREELANCER');

  // client posts job
  const createJobQ = `
    mutation($title:String!,$description:String!,$budget:Float!){
      createJob(title:$title,description:$description,budget:$budget){ id }
    }
  `;
  let jres = await fetchGraphQL(createJobQ, { title:'Review test', description:'desc', budget:50 }, client.token);
  const jobId = jres.data.createJob.id;
  console.log('created job', jobId);

  // freelancer submits proposal
  const proposalQ = `
    mutation($jobId:ID!,$coverLetter:String!,$bidAmount:Float!){
      submitProposal(jobId:$jobId,coverLetter:$coverLetter,bidAmount:$bidAmount){ id }
    }
  `;
  await fetchGraphQL(proposalQ, { jobId, coverLetter:'here', bidAmount:50 }, freelancer.token);

  // get proposal id
  const propListQ = `query{ myProposals{ id job{id} } }`;
  const propRes = await fetchGraphQL(propListQ, {}, freelancer.token);
  const proposalId = propRes.data.myProposals.find(p=>p.job.id==jobId).id;

  // client accepts proposal
  const acceptQ = `mutation($proposalId:ID!){ acceptProposal(proposalId:$proposalId){ id } }`;
  await fetchGraphQL(acceptQ, { proposalId }, client.token);

  // client submits review for freelancer
  const reviewQ = `
    mutation($revieweeId:ID!,$jobId:ID!,$rating:Int!,$comment:String){
      submitReview(revieweeId:$revieweeId,jobId:$jobId,rating:$rating,comment:$comment){ id rating }
    }
  `;
  const rjson = await fetchGraphQL(reviewQ, { revieweeId: freelancer.id, jobId, rating:5, comment:'Great work' }, client.token);
  console.log('submit review', rjson);

  // query reviewsByUser
  const getReviewsQ = `query($userId:ID!){ reviewsByUser(userId:$userId){ id rating comment } }`;
  const revs = await fetchGraphQL(getReviewsQ, { userId: freelancer.id }, client.token);
  console.log('reviews for freelancer', revs);

  // query all users with averageRating and filter for freelancer
  const userQ = `query{ users{ id username averageRating }} `;
  const usersRes = await fetchGraphQL(userQ, {}, client.token);
  console.log('all users excerpt', usersRes);
  const fl = usersRes.data.users.find(u=>u.id==freelancer.id);
  console.log('freelancer avg rating', fl.averageRating);

}

run().catch(console.error);
