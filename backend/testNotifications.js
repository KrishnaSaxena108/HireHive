require('dotenv').config();
// node 20+ has global fetch available

const GRAPHQL_URL = 'http://localhost:4000/graphql';

async function run() {
  console.log('Testing notification flow');

  // 1. create a user (client)
  const registerMutation = `
    mutation Register($username: String!, $email: String!, $password: String!, $role: String!) {
      register(username: $username, email: $email, password: $password, role: $role) {
        token
        user { id username role }
      }
    }
  `;

  const variables = {
    username: 'notif_test',
    email: 'notif_test@example.com',
    password: 'password',
    role: 'CLIENT'
  };

  let res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: registerMutation, variables })
  });
  let json = await res.json();
  console.log('register response', json);
  let token, userId;
  if (json.data && json.data.register) {
    token = json.data.register.token;
    userId = json.data.register.user.id;
  } else {
    // user exists, try logging in
    const loginMutation = `
      mutation Login($email:String!, $password:String!){
        login(email:$email,password:$password){ token user { id }}
      }
    `;
    res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: loginMutation, variables: { email: variables.email, password: variables.password } })
    });
    json = await res.json();
    console.log('login response', json);
    token = json.data.login.token;
    userId = json.data.login.user.id;
  }

  // 2. create job with auth header
  const createJob = `
    mutation($title:String!, $description:String!, $budget:Float!){
      createJob(title:$title,description:$description,budget:$budget){ id title }
    }
  `;
  res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query: createJob, variables: { title: 'Test job', description: 'desc', budget: 100 } })
  });
  console.log('create job response', await res.json());

  // 3. query notifications for the user
  const notifQuery = `
    query($userId:ID!){ notifications(userId:$userId){ id message isRead }}
  `;
  res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query: notifQuery, variables: { userId } })
  });
  let result = await res.json();
  console.log('notifications', result);

  // 4. mark first notification read
  if (result.data.notifications.length > 0) {
    const firstId = result.data.notifications[0].id;
    const markMutation = `
      mutation($id:ID!){ markNotificationRead(id:$id){ id isRead }}
    `;
    res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: markMutation, variables: { id: firstId } })
    });
    console.log('mark read response', await res.json());

    // query again
    res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: notifQuery, variables: { userId } })
    });
    console.log('notifications after mark', await res.json());
  }
}

run().catch(err=>console.error(err));
