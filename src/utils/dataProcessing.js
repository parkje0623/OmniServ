// Help Function for propcessing Age & Gender Data
export const processAgeGender = (data) => {
    const labels = Object.keys(data);
    const datasets = [];
    const backgroundColors = ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(54, 0, 235, 0.6)'];
    const platforms = Object.keys(data[labels[0]]); // Get platforms from the first age group
    
    platforms.forEach((platform, index) => {
        const maleData = [];
        const femaleData = [];
        const nonbinaryData = [];

        labels.forEach((label) => {
            maleData.push(data[label][platform].male.spentHour);
            femaleData.push(data[label][platform].female.spentHour);
            nonbinaryData.push(data[label][platform]['non-binary'].spentHour);
        });

        // Add datasets for male and female
        datasets.push(
            {
                label: `${platform}`,
                data: maleData,
                backgroundColor: backgroundColors[index],
                stack: 'male',
            },
            {
                label: `${platform}`,
                data: femaleData,
                backgroundColor: backgroundColors[index],
                stack: 'female',
            },
            {
                label: `${platform}`,
                data: nonbinaryData,
                backgroundColor: backgroundColors[index],
                stack: 'non-binary',
            }
        );
    });

    return { labels, datasets };
};

// Helper Function for processing Top 3 Data
const topThreeData = (data, topic) => {
    const topDataMap = {};

    data.forEach((item) => {
        const topicItem = item[topic];
        if (!topDataMap[topicItem]) {
            topDataMap[topicItem] = { amount: 0 };
        }

        topDataMap[topicItem].amount += 1;
    });

    const topThree = Object.entries(topDataMap)
                        .sort((a, b) => b[1].amount - a[1].amount)
                        .slice(0, 3)
                        .map(([key, value]) => ({
                            topic: key, 
                            amount: value.amount 
                        }));

    return topThree;
};
// Helper Function for Updating Gender Interest
export const updateGenderInterest = (gender, data) => {
    const filteredData = data.filter(item => item.gender === gender);
    const topThree = topThreeData(filteredData, 'interests');
    const colorMap = {
        'male': 'rgba(54, 162, 235, 0.8)',  
        'female': 'rgba(255, 99, 132, 0.8)', 
        'non-binary': 'rgba(54, 0, 235, 0.8)',  
    };

    return {
        labels: topThree.map(item => item.topic),
        datasets: [
            {
                label: 'Count',
                data: topThree.map(item => item.amount),
                backgroundColor: filteredData.map(item => colorMap[item.gender] || 'rgba(128, 128, 128, 0.8)'),
            }
        ]
    };
};