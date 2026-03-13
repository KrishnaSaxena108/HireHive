const { ApolloServer } = require('@apollo/server');
const { createTestClient } = require('apollo-server-testing');
const typeDefs = require('../src/graphql/typeDefs');
const resolvers = require('../src/graphql/resolvers');
const { sequelize } = require('../models');

// Mock authentication context
const mockContext = ({ req }) => {
  // Mock admin user for testing
  const user = {
    id: 1,
    username: 'admin',
    email: 'admin@hirehive.com',
    role: 'ADMIN'
  };
  return { user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: mockContext,
});

const { query, mutate } = createTestClient(server);

async function runAdminTests() {
  console.log('🧪 Running Admin Moderation Tools Tests...\n');

  try {
    // Test 1: Admin Stats Query
    console.log('1. Testing adminStats query...');
    const statsResult = await query({
      query: `
        query {
          adminStats {
            totalUsers
            totalJobs
            totalProposals
            activeJobs
            completedJobs
          }
        }
      `
    });

    if (statsResult.errors) {
      console.log('❌ adminStats query failed:', statsResult.errors);
    } else {
      console.log('✅ adminStats query successful');
      console.log('   Stats:', statsResult.data?.adminStats || 'No data');
    }

    // Test 2: Admin Users Query
    console.log('\n2. Testing adminUsers query...');
    const usersResult = await query({
      query: `
        query {
          adminUsers {
            id
            username
            email
            role
            createdAt
          }
        }
      `
    });

    if (usersResult.errors) {
      console.log('❌ adminUsers query failed:', usersResult.errors);
    } else {
      console.log('✅ adminUsers query successful');
      console.log(`   Found ${usersResult.data?.adminUsers?.length || 0} users`);
    }

    // Test 3: Admin Jobs Query
    console.log('\n3. Testing adminJobs query...');
    const jobsResult = await query({
      query: `
        query {
          adminJobs {
            id
            title
            status
            budget
            category
            client {
              username
            }
          }
        }
      `
    });

    if (jobsResult.errors) {
      console.log('❌ adminJobs query failed:', jobsResult.errors);
    } else {
      console.log('✅ adminJobs query successful');
      console.log(`   Found ${jobsResult.data?.adminJobs?.length || 0} jobs`);
    }

    // Test 4: Admin Proposals Query
    console.log('\n4. Testing adminProposals query...');
    const proposalsResult = await query({
      query: `
        query {
          adminProposals {
            id
            coverLetter
            bidAmount
            status
            job {
              title
            }
            freelancer {
              username
            }
          }
        }
      `
    });

    if (proposalsResult.errors) {
      console.log('❌ adminProposals query failed:', proposalsResult.errors);
    } else {
      console.log('✅ adminProposals query successful');
      console.log(`   Found ${proposalsResult.data?.adminProposals?.length || 0} proposals`);
    }

    // Test 5: Suspend User Mutation (if there are users to suspend)
    if (usersResult.data?.adminUsers?.length > 0) {
      const testUser = usersResult.data.adminUsers.find(u => u.role !== 'ADMIN' && u.role !== 'SUSPENDED');
      if (testUser) {
        console.log('\n5. Testing suspendUser mutation...');
        const suspendResult = await mutate({
          mutation: `
            mutation($userId: ID!) {
              suspendUser(userId: $userId) {
                id
                username
                role
              }
            }
          `,
          variables: { userId: testUser.id }
        });

        if (suspendResult.errors) {
          console.log('❌ suspendUser mutation failed:', suspendResult.errors);
        } else {
          console.log('✅ suspendUser mutation successful');
          console.log('   User suspended:', suspendResult.data.suspendUser);
        }

        // Test 6: Activate User Mutation
        console.log('\n6. Testing activateUser mutation...');
        const activateResult = await mutate({
          mutation: `
            mutation($userId: ID!) {
              activateUser(userId: $userId) {
                id
                username
                role
              }
            }
          `,
          variables: { userId: testUser.id }
        });

        if (activateResult.errors) {
          console.log('❌ activateUser mutation failed:', activateResult.errors);
        } else {
          console.log('✅ activateUser mutation successful');
          console.log('   User activated:', activateResult.data.activateUser);
        }
      }
    }

    // Test 7: Delete Job Mutation (if there are jobs to delete)
    if (jobsResult.data?.adminJobs?.length > 0) {
      console.log('\n7. Testing deleteJob mutation...');
      const deleteJobResult = await mutate({
        mutation: `
          mutation($jobId: ID!) {
            deleteJob(jobId: $jobId)
          }
        `,
        variables: { jobId: jobsResult.data.adminJobs[0].id }
      });

      if (deleteJobResult.errors) {
        console.log('❌ deleteJob mutation failed:', deleteJobResult.errors);
      } else {
        console.log('✅ deleteJob mutation successful');
        console.log('   Job deleted successfully');
      }
    }

    // Test 8: Delete Proposal Mutation (if there are proposals to delete)
    if (proposalsResult.data?.adminProposals?.length > 0) {
      console.log('\n8. Testing deleteProposal mutation...');
      const deleteProposalResult = await mutate({
        mutation: `
          mutation($proposalId: ID!) {
            deleteProposal(proposalId: $proposalId)
          }
        `,
        variables: { proposalId: proposalsResult.data.adminProposals[0].id }
      });

      if (deleteProposalResult.errors) {
        console.log('❌ deleteProposal mutation failed:', deleteProposalResult.errors);
      } else {
        console.log('✅ deleteProposal mutation successful');
        console.log('   Proposal deleted successfully');
      }
    }

    // Test 9: Non-admin access test (should fail)
    console.log('\n9. Testing non-admin access (should fail)...');
    const nonAdminContext = ({ req }) => {
      const user = {
        id: 2,
        username: 'client',
        email: 'client@hirehive.com',
        role: 'CLIENT'
      };
      return { user };
    };

    const nonAdminServer = new ApolloServer({
      typeDefs,
      resolvers,
      context: nonAdminContext,
    });

    const { query: nonAdminQuery } = createTestClient(nonAdminServer);

    const nonAdminResult = await nonAdminQuery({
      query: `
        query {
          adminUsers {
            id
            username
          }
        }
      `
    });

    if (nonAdminResult.errors && nonAdminResult.errors[0].message.includes('Admin access required')) {
      console.log('✅ Non-admin access properly blocked');
    } else {
      console.log('❌ Non-admin access not properly blocked');
      if (nonAdminResult.errors) {
        console.log('   Errors:', nonAdminResult.errors.map(e => e.message));
      } else {
        console.log('   No errors found, result:', nonAdminResult.data);
      }
    }

    console.log('\n🎉 Admin Moderation Tools Tests Completed!');

  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await sequelize.close();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAdminTests();
}

module.exports = { runAdminTests };
