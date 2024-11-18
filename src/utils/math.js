import { updateGenderInterest } from './dataProcessing';

// Helper Function for Formatting Numbers
export const formatNumber = (number, isPercentage) => {
    if (isPercentage) {
        // For Percentage Formatting
        return `${Math.round((number + Number.EPSILON) * 1000) / 10} %`;
    } else {
        // For Large Number Formatting
        if (number >= 1000000) {
            return `${Math.round(((number / 1000000) + Number.EPSILON) * 10) / 10} M`;
        } else if (number >= 1000) {
            return `${Math.round(((number / 1000) + Number.EPSILON) * 10) / 10} K`;
        } else {
            return Math.round(number + Number.EPSILON).toString();
        }
    }
}

// Helper Function for Grouping Data by Age Group, Gender, and Platform
export const groupByAgeGender = (data) => {
    const ageGenderMap = {};
    const ageGroups = [
        { min: 17, max: 25, group: '18-25' },
        { min: 25, max: 35, group: '26-35' },
        { min: 35, max: 45, group: '36-45' },
        { min: 45, max: 55, group: '46-55' },
        { min: 55, max: 65, group: '56-65' }
    ];

    ageGroups.forEach((grp) => {
        ageGenderMap[grp.group] = {
            Facebook: {
                male: { spentHour: 0 },
                female: { spentHour: 0 },
                'non-binary': { spentHour: 0 }
            },
            Instagram: {
                male: { spentHour: 0 },
                female: { spentHour: 0 },
                'non-binary': { spentHour: 0 }
            },
            YouTube: {
                male: { spentHour: 0 },
                female: { spentHour: 0 },
                'non-binary': { spentHour: 0 }
            },
        }
    });
    
    data.forEach((row) => {
        const age = parseInt(row.age);
        const platform = row.platform;
        const gender = row.gender;
        const hourSpent = row.time_spent;
        const ageGroup = ageGroups.find((group) => age > group.min && age <= group.max);
        
        if (ageGroup) {
            ageGenderMap[ageGroup.group][platform][gender].spentHour += parseInt(hourSpent);
        }
    });

    return ageGenderMap;
};

// Helper Function for Calculating KPI Data
export const calculateKPIData = (data) => {
    let [avgTimeSpent, avgIncome, debtUsers, owners] = [0, 0, 0, 0];
    data.forEach(row => {
        avgTimeSpent += parseInt(row.time_spent);
        avgIncome += parseFloat(row.income);
        debtUsers += row.indebt === 'TRUE' ? 1 : 0;
        owners += row.isHomeOwner === 'TRUE' || row.Owns_Car === 'TRUE' ? 1 : 0;
    });

    const dataLength = data.length;
    return {
        avgTimeSpent: Math.round(avgTimeSpent / dataLength),
        avgIncome: formatNumber(avgIncome / dataLength),
        debtUsers: formatNumber(debtUsers / dataLength, true),
        homeCarOwners: formatNumber(owners / dataLength, true)
    };
};
// Helper Function for Calculating Gender Interest
export const calculateGenderInterest = (data) => {
    const genders = ['male', 'female', 'non-binary'];
    const updatedGenderInterest = {};
    genders.forEach(gender => {
        updatedGenderInterest[gender] = updateGenderInterest(gender, data);
    });
    return updatedGenderInterest;
};
// Helper Function for Calculating Income vs. Platform
export const calculateIncomePlatformData = (data) => {
    const incomePlatform = [];
    for (let i = 10000; i < 20000; i += 100) {
        const filteredData = data.filter(item => item.income > i && item.income <= i + 100);
        const avgTimeSpent = filteredData.reduce((sum, item) => sum + parseInt(item.time_spent), 0) / filteredData.length || 0;
        incomePlatform.push({ x: i + 100, y: Math.round(avgTimeSpent * 10) / 10 });
    }
    return [{ data: incomePlatform, backgroundColor: 'rgba(75, 192, 192, 0.6)' }];
};
// Helper Function for Calculating Location vs. Demographic
export const calculateLocationDemographic = (data, ageGroups, regions) => {
    return ageGroups.flatMap(group =>
        regions.map(region => {
            const filteredData = data.filter(item =>
                parseInt(item.age) > group.min &&
                parseInt(item.age) <= group.max &&
                item.demographics === region
            );
            const totalTimeSpent = filteredData.reduce((sum, item) => sum + parseInt(item.time_spent), 0);
            return { x: region, y: group.group, v: totalTimeSpent };
        })
    );
};
// Helper Function for Calculating Interest on Age Groups
export const calculateTimeOnInterest = (data, ageGroups, interests) => {
    const interestMap = { Sports: [], Travel: [], Lifestyle: [] };
    ageGroups.forEach(group => {
        interests.forEach(interest => {
            const filteredData = data.filter(item =>
                parseInt(item.age) > group.min &&
                parseInt(item.age) <= group.max &&
                item.interests === interest
            );
            const totalTimeSpent = filteredData.reduce((sum, item) => sum + parseInt(item.time_spent), 0);
            interestMap[interest].push(totalTimeSpent);
        });
    });
    return interestMap;
};


// Helper Function for Calculating Simple KPI Data (in Analytics)
export const calculateSimpleKPIData = (data) => {
    let [avgAge, totalHours, topInterestTimeSpent] = [0, 0, {}];
    data.forEach(row => {
        avgAge += parseInt(row.age);
        totalHours += parseInt(row.time_spent);

        if (row.interests) {
            if (!topInterestTimeSpent[row.interests]) {
                topInterestTimeSpent[row.interests] = 0;
            }
            topInterestTimeSpent[row.interests] += parseInt(row.time_spent);
        }
    });

    // To Find the Top Gender:
    const topInterest = Object.keys(topInterestTimeSpent).reduce((a, b) => 
        topInterestTimeSpent[a] > topInterestTimeSpent[b] ? a : b
    );
    // Set the Returning Data
    const dataLength = data.length;
    return {
        totalUsers: formatNumber(dataLength),
        totalTimeSpent: formatNumber(totalHours),
        avgAge: formatNumber(avgAge / dataLength),
        topInterestEngagement: { interest: `${topInterest}`, value: formatNumber(topInterestTimeSpent[`${topInterest}`]) }
    };
};