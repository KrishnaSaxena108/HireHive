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
  console.log('Testing advanced search feature');

  // Register client
  const regQ = `
    mutation($username:String!,$email:String!,$password:String!,$role:String!){
      register(username:$username,email:$email,password:$password,role:$role){ token user{id}}
    }
  `;
  let json = await fetchGraphQL(regQ, { 
    username: 'searchtest', 
    email: 'searchtest@example.com', 
    password: 'pass123', 
    role: 'CLIENT' 
  });
  
  if (json.errors) {
    const loginQ = `
      mutation($email:String!,$password:String!){ 
        login(email:$email,password:$password){ token user{id}}
      }
    `;
    json = await fetchGraphQL(loginQ, { email: 'searchtest@example.com', password: 'pass123' });
  }
  
  const token = json.data.register ? json.data.register.token : json.data.login.token;

  // Create test jobs with different properties
  const createJobQ = `
    mutation($title:String!,$description:String!,$budget:Float!,$category:String){
      createJob(title:$title,description:$description,budget:$budget,category:$category){ id title budget }
    }
  `;
  
  const testJobs = [
    { title: 'React Website Builder', description: 'Need expert React developer for e-commerce site', budget: 2000, category: 'WEB_DEV' },
    { title: 'Mobile App iOS Developer', description: 'Build iOS app with Swift for fitness tracking', budget: 5000, category: 'MOBILE_DEV' },
    { title: 'UI/UX Designer', description: 'Design modern dashboard interface', budget: 1500, category: 'DESIGN' },
    { title: 'Tech Blog Writer', description: 'Write 10 technical articles about web development', budget: 500, category: 'WRITING' },
    { title: 'SEM Marketing Campaign', description: 'Manage Google Ads and Facebook ads for startup', budget: 3000, category: 'MARKETING' },
  ];
  
  console.log('Creating test jobs...');
  for (const job of testJobs) {
    await fetchGraphQL(createJobQ, job, token);
  }
  console.log('✓ Created 5 test jobs');

  // Test 1: Keyword search for "developer"
  const searchQ = `
    query($keyword:String){ 
      searchJobs(keyword:$keyword){ id title budget category }
    }
  `;
  
  let results = await fetchGraphQL(searchQ, { keyword: 'developer' }, token);
  console.log(`\n1. Search for "developer": ${results.data?.searchJobs?.length} results`);

  // Test 2: Category filter
  results = await fetchGraphQL(searchQ, { keyword: null, category: 'WEB_DEV' }, token);
  console.log(`2. Filter by WEB_DEV category: ${results.data?.searchJobs?.length} results`);

  // Test 3: Budget range (2000-5000)
  results = await fetchGraphQL(searchQ, { minBudget: 2000, maxBudget: 5000 }, token);
  console.log(`3. Budget range $2000-$5000: ${results.data?.searchJobs?.length} results`);

  // Test 4: Keyword + Category (developer + MOBILE_DEV)
  results = await fetchGraphQL(searchQ, { keyword: 'developer', category: 'MOBILE_DEV' }, token);
  console.log(`4. Search "developer" in MOBILE_DEV: ${results.data?.searchJobs?.length} results`);

  // Test 5: Multiple filters (keyword + budget)
  results = await fetchGraphQL(searchQ, { keyword: 'app', minBudget: 1000 }, token);
  const jobTitles = results.data?.searchJobs?.map(j => j.title) || [];
  console.log(`5. Search "app" with budget >= $1000: ${jobTitles.length} results`);
  if (jobTitles.length > 0) console.log(`   Titles: ${jobTitles.join(', ')}`);

  // Test 6: Status filter (OPEN)
  results = await fetchGraphQL(searchQ, { status: 'OPEN' }, token);
  console.log(`6. Filter by OPEN status: ${results.data?.searchJobs?.length} results`);

}

run().catch(console.error);
