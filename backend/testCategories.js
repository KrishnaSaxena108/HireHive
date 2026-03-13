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
  console.log('Testing job categories feature');

  // Register a client
  const regQ = `
    mutation($username:String!,$email:String!,$password:String!,$role:String!){
      register(username:$username,email:$email,password:$password,role:$role){ token user{id}}
    }
  `;
  let json = await fetchGraphQL(regQ, { 
    username: 'catclient', 
    email: 'catclient@example.com', 
    password: 'pass123', 
    role: 'CLIENT' 
  });
  
  if (json.errors) {
    // login if already exists
    const loginQ = `
      mutation($email:String!,$password:String!){ 
        login(email:$email,password:$password){ token user{id}}
      }
    `;
    json = await fetchGraphQL(loginQ, { email: 'catclient@example.com', password: 'pass123' });
  }
  
  const token = json.data.register ? json.data.register.token : json.data.login.token;
  
  // Create jobs in different categories
  const createJobQ = `
    mutation($title:String!,$description:String!,$budget:Float!,$category:String){
      createJob(title:$title,description:$description,budget:$budget,category:$category){ id title category }
    }
  `;
  
  const categories = ['WEB_DEV', 'MOBILE_DEV', 'DESIGN', 'WRITING', 'MARKETING'];
  
  for (const cat of categories) {
    const jres = await fetchGraphQL(createJobQ, { 
      title: `${cat} Job`, 
      description: `Job in ${cat}`, 
      budget: 100, 
      category: cat 
    }, token);
    console.log(`Created job in ${cat}:`, jres.data?.createJob?.id);
  }
  
  // Query jobs by category
  const filterQ = `
    query($category:String!){ 
      jobsByCategory(category:$category){ id title category status }
    }
  `;
  
  for (const cat of categories) {
    const jres = await fetchGraphQL(filterQ, { category: cat }, token);
    const jobs = jres.data?.jobsByCategory || [];
    console.log(`Jobs in ${cat}: ${jobs.length} found`);
  }
  
}

run().catch(console.error);
