document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('userForm');
    const loadingScreen = document.getElementById('loadingScreen');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const cfUsername = document.getElementById('CFuserName').value.trim();
        const lcUsername = document.getElementById('LCuserName').value.trim();
        // const ccUsername = document.getElementById('CCuserName').value.trim();
        const gfgUsername = document.getElementById('gfguserName').value.trim();

        console.log('CF Username:', cfUsername);
        console.log('LC Username:', lcUsername);
        // console.log('CC Username:', ccUsername);
        console.log('gfg Username:', gfgUsername);

        if (!cfUsername && !lcUsername  && !gfgUsername) {
            alert('Please enter at least one handle.');
            return;
        }

        try {
            loadingScreen.style.display = 'flex';
            if (cfUsername) {
                await fetchCodeForcesData(cfUsername.toLowerCase());
                document.getElementById('CodeForces').style.display = 'block';
            }
            if (lcUsername) {
                await fetchLeetCodeData(lcUsername.toLowerCase());
                document.getElementById('LeetCode').style.display = 'block';
            }
            // if (ccUsername) {
                //     fetchPromises.push(fetchUserData('codechef', ccUsername));
                // }
                if (gfgUsername) {
                    await fetchgfgData(gfgUsername.toLowerCase());
                    document.getElementById('geeksforgeeks').style.display = 'block';
            }
            if(cf || lc  || gfg){
                renderOvChart(cf, lc, gfg);
            }
            

        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            // Hide loading screen
            loadingScreen.style.display = 'none';
            document.getElementById('homePage').style.display = 'none';
            document.getElementById('dataPage').style.display = 'flex';
        }
    });


    
    let ovChart = null;
    let cf = 0;
    let lc = 0;
    let gfg = 0;

function renderOvChart(cf, lc, gfg) {
    const canvas = document.getElementById('ovChart');
    document.getElementById('cfTotal').textContent = cf;
    document.getElementById('lcTotal').textContent = lc;
    document.getElementById('gfgTotal').textContent = gfg;
    document.getElementById('totalQ').textContent = cf + lc + gfg;

    if (ovChart instanceof Chart) {
        ovChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    
    ovChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [cf, lc, gfg],
                backgroundColor: [
                    'rgb(34, 211, 238)',  // cyan-400
                    'rgb(251, 146, 60)', // orange-400
                    'rgb(248, 113, 113)', // red-400
                    'rgb(55, 65, 81)'  // gray-700
                ],
                borderWidth: 0,
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

let lcChart = null;

function renderlcChart(easy, med, hard) {
    if (lcChart instanceof Chart) {
        lcChart.destroy();
    }
    const ctx = document.getElementById('lcChart').getContext('2d');

    lcChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [easy, med, hard],
                backgroundColor: [
                    'rgb(34, 211, 238)',  // cyan-400
                    'rgb(251, 146, 60)', // orange-400
                    'rgb(248, 113, 113)', // red-400
                    'rgb(55, 65, 81)'  // gray-700
                ],
                borderWidth: 0,
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}


let cfChart = null;

function rendercfChart(easy,med,hard) {
    const canvas = document.getElementById('cfChart');
    
    if (cfChart instanceof Chart) {
        cfChart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    cfChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        datasets: [{
            data: [easy, med, hard],
            backgroundColor: [
                'rgb(34, 211, 238)',  // cyan-400
                'rgb(251, 146, 60)', // orange-400
                'rgb(248, 113, 113)', // red-400
                'rgb(55, 65, 81)'  // gray-700
            ],
            borderWidth: 0,
        }]
    },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
            },
            tooltip: {
                enabled: false
            }
        }
    }
    });
}

let gfgChart = null;

function rendergfgChart(easy, med, hard) {
    if (gfgChart instanceof Chart) {
        gfgChart.destroy();
    }
    const ctx = document.getElementById('gfgChart').getContext('2d');
    
    gfgChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
        datasets: [{
            data: [70, 122, 22],
            backgroundColor: [
                'rgb(34, 211, 238)',  // cyan-400
                'rgb(251, 146, 60)', // orange-400
                'rgb(248, 113, 113)', // red-400
                'rgb(55, 65, 81)'  // gray-700
            ],
            borderWidth: 0,
        }]
    },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

async function fetchCodeForcesData(handle) {
    try {
        const userInfoResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        const userInfo = await userInfoResponse.json();
        
        const userStatusResponse = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const userStatus = await userStatusResponse.json();
        
        const ratingChangesResponse = await fetch(`https://codeforces.com/api/user.rating?handle=${handle}`);
        const ratingChanges = await ratingChangesResponse.json();
        
        if (userInfo.status === 'OK' && userStatus.status === 'OK' && ratingChanges.status === 'OK') {
            const user = userInfo.result[0];
            const submissions = userStatus.result;
            const contests = ratingChanges.result;

            document.getElementById('cfRank').textContent = user.rank;
            document.getElementById('cfRating').textContent = user.rating;
            document.getElementById('cfMaxRating').textContent = user.maxRating;
            
            const lastContest = contests[contests.length - 1];
            document.getElementById('cfRatingChange').textContent = lastContest.newRating - lastContest.oldRating;
            
            document.getElementById('cfContests').textContent = contests.length;
            document.getElementById('cfContribution').textContent = user.contribution;
            
            const solved = new Set();
            const difficulty = { easy: 0, medium: 0, hard: 0 };
            const tags = {};
            
            submissions.forEach(submission => {
                if (submission.verdict === 'OK') {
                    const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
                    if (!solved.has(problemId)) {
                        solved.add(problemId);
                        
                        if (submission.problem.rating <= 1000) difficulty.easy++;
                        else if (submission.problem.rating < 1400) difficulty.medium++;
                        else difficulty.hard++;

                        submission.problem.tags.forEach(tag => {
                            tags[tag] = (tags[tag] || 0) + 1;
                        });
                    }
                }
            });
            rendercfChart(difficulty.easy,difficulty.medium,difficulty.hard);
            document.querySelector('#cfChart + div p.text-2xl').textContent = solved.size;
            cf = solved.size;
            document.querySelector('.text-cyan-400 + span').textContent = difficulty.easy;
            document.querySelector('.text-orange-400 + span').textContent = difficulty.medium;
            document.querySelector('.text-red-400 + span').textContent = difficulty.hard;

            const topTagsContainer = document.querySelector('div.flex.flex-wrap.gap-2');
            topTagsContainer.innerHTML = '';
            Object.entries(tags)
            .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .forEach(([tag, count]) => {
                    topTagsContainer.innerHTML += `<span class="bg-blue-500 px-2 py-1 rounded text-xs">${tag} (${count})</span>`;
                });

            const recentContestsContainer = document.querySelector('h3.text-lg.font-semibold.mb-2 + div.text-sm');
            recentContestsContainer.innerHTML = '';
            contests.slice(-3).reverse().forEach(contest => {
                recentContestsContainer.innerHTML += `<p>Contest ${contest.contestId}: Rank ${contest.rank} (Rating Change: ${contest.newRating - contest.oldRating})</p>`;
            });
            
            document.getElementById('cfFriends').textContent = user.friendOfCount;
            document.getElementById('cfLastOnline').textContent = new Date(user.lastOnlineTimeSeconds * 1000).toLocaleString();
            
        } else {
            throw new Error('Failed to fetch data from CodeForces API');
        }
    } catch (error) {
        console.error('Error fetching CodeForces data:', error);
    }
}

// fetchCodeForcesData('tic_tac');

async function fetchLeetCodeData(username) {
    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        if (data.status === "success") {
 
            document.getElementById('lcUsername').textContent = username;
            document.getElementById('lcTotalSolved').textContent = data.totalSolved;
            document.getElementById('lcAcceptanceRate').textContent = data.acceptanceRate.toFixed(1) + '%';
            document.getElementById('lcE').textContent = data.easySolved;
            document.getElementById('lcM').textContent = data.mediumSolved;
            document.getElementById('lcH').textContent = data.hardSolved;
            
            renderlcChart(data.easySolved,data.mediumSolved,data.hardSolved);
            
            document.getElementById('lcTotalQuestions').textContent = data.totalQuestions;
            document.getElementById('lcSolved').textContent = data.totalSolved;
            lc=data.totalSolved;

            document.getElementById('lcContributionPoints').textContent = data.contributionPoints;
            document.getElementById('lcReputation').textContent = data.reputation;
            
            const easyPercentage = ((data.easySolved / data.totalEasy) * 100).toFixed(1);
            const mediumPercentage = ((data.mediumSolved / data.totalMedium) * 100).toFixed(1);
            const hardPercentage = ((data.hardSolved / data.totalHard) * 100).toFixed(1);
            
            document.getElementById('lcEasyPercentage').textContent = easyPercentage + '%';
            document.getElementById('lcMediumPercentage').textContent = mediumPercentage + '%';
            document.getElementById('lcHardPercentage').textContent = hardPercentage + '%';
            
            console.log("LeetCode data fetched successfully");
        } else {
            throw new Error('Data retrieval unsuccessful');
        }
    } catch (error) {
        console.error('Error fetching LeetCode data:', error);
        document.getElementById('lcUsername').textContent = 'Error';
        document.getElementById('lcRanking').textContent = 'N/A';
        document.getElementById('lcTotalSolved').textContent = 'N/A';
        document.getElementById('lcAcceptanceRate').textContent = 'N/A';
    }
}


// fetchLeetCodeData('tic_tac');

async function fetchgfgData(handle){
    let url = 'https://geeks-for-geeks-stats-api.vercel.app/?raw=y&userName=' + handle;
    let response = await fetch(url);
    let data = await response.json();
    let easycont = document.getElementById('gfgE');
    let medcont = document.getElementById('gfgM');
    let hardcont = document.getElementById('gfgH');
    let total = document.getElementById('gfgT');
    easycont.textContent = data.Easy;
    medcont.textContent = data.Medium;
    hardcont.textContent = data.Hard;
    total.textContent = data.Easy + data.Medium + data.Hard;
    gfg = data.Easy + data.Medium + data.Hard;
    rendergfgChart(data.Easy,data.Medium,data.Hard);
    
    
}
});

function returnHome(){
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('dataPage').style.display = 'none';
    document.getElementById('CodeForces').style.display = 'none';
    document.getElementById('LeetCode').style.display = 'none';
    document.getElementById('geeksforgeeks').style.display = 'none';
}