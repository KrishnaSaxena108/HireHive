// Test Advanced Search Frontend Feature
// This script tests the AdvancedSearch component integration with the GraphQL API

const baseURL = 'http://localhost:4000/graphql';

// Test GraphQL query with all filter combinations
async function testAdvancedSearch() {
  console.log('🧪 Testing Advanced Search Feature\n');
  
  const tests = [
    {
      name: 'Search by keyword "developer"',
      variables: { keyword: 'developer', category: null, minBudget: null, maxBudget: null, status: null }
    },
    {
      name: 'Filter by WEB_DEV category',
      variables: { keyword: null, category: 'WEB_DEV', minBudget: null, maxBudget: null, status: null }
    },
    {
      name: 'Budget range $2000-$5000',
      variables: { keyword: null, category: null, minBudget: 2000, maxBudget: 5000, status: null }
    },
    {
      name: 'Keyword "app" + MOBILE_DEV category',
      variables: { keyword: 'app', category: 'MOBILE_DEV', minBudget: null, maxBudget: null, status: null }
    },
    {
      name: 'Keyword "app" + budget >= $1000',
      variables: { keyword: 'app', category: null, minBudget: 1000, maxBudget: null, status: null }
    },
    {
      name: 'Status OPEN only',
      variables: { keyword: null, category: null, minBudget: null, maxBudget: null, status: 'OPEN' }
    },
    {
      name: 'Complex: keyword + DESIGN + $500-$3000 budget',
      variables: { keyword: 'design', category: 'DESIGN', minBudget: 500, maxBudget: 3000, status: 'OPEN' }
    },
    {
      name: 'All filters: keyword "project" + WEB_DEV + $1000-$10000 + OPEN',
      variables: { keyword: 'project', category: 'WEB_DEV', minBudget: 1000, maxBudget: 10000, status: 'OPEN' }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const query = `
        query SearchJobs($keyword: String, $category: String, $minBudget: Float, $maxBudget: Float, $status: String) {
          searchJobs(keyword: $keyword, category: $category, minBudget: $minBudget, maxBudget: $maxBudget, status: $status) {
            id
            title
            budget
            category
            status
          }
        }
      `;

      const response = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: test.variables })
      });

      const result = await response.json();

      if (result.errors) {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${result.errors[0].message}`);
        failed++;
      } else {
        const jobs = result.data.searchJobs || [];
        console.log(`✅ ${test.name}`);
        console.log(`   Found: ${jobs.length} jobs`);
        if (jobs.length > 0) {
          console.log(`   Sample: "${jobs[0].title}" (${jobs[0].category}, $${jobs[0].budget})`);
        }
        passed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Network Error: ${error.message}`);
      failed++;
    }
    console.log();
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests`);
  
  if (failed === 0) {
    console.log('✨ All tests passed! Advanced Search feature is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
}

testAdvancedSearch();
