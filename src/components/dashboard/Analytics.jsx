import React, { useState, useEffect } from 'react';
import Card from '../Card';
import useFetchCSV from '../../hooks/useFetchCSV';
import { calculateKPIData, calculateSimpleKPIData } from '../../utils/math';

import LineChart from '../LineChart';
import DonutChart from '../DonutChart';

function Analytics() {
    const { data } = useFetchCSV('/analytics.csv');

    // First 4 KPI Data object
    const [kpiData, setKpiData] = useState({
        totalUsers: 0,
        totalTimeSpent: 0,
        avgAge: 0,
        topInterestEngagement: { interest: '', value: 0},
    });
    // Second 4 KPI Data object
    const [advancedKPIData, setAdvancedKPIData] = useState({
        avgTimeSpent: 0,
        avgIncome: 0,
        debtUsers: 0,
        homeCarOwners: 0
    });
    // Line Chart Data
    const [ageGroupTimeSpent, setAgeGroupTimeSpent] = useState({});
    // Donut Chart Data
    const [platformTimeSpent, setPlatformTimeSpent] = useState({});
    // Table Chart Data
    const [tableData, setTableData] = useState([]);
  
    useEffect(() => {
        if (!data || data.length === 0) {
            return;
        } 

        // Calculate the First 4 KPI data
        setKpiData(calculateSimpleKPIData(data));
        // Calculate the Second 4 KPI data
        setAdvancedKPIData(calculateKPIData(data));

        // Calculate Time Spent for each Age Group
        const ageGroupDataMap = {};
        const ageGroups = [
            { min:17, max: 25, group: '18-25' }, 
            { min:25, max: 35, group: '26-35' }, 
            { min:35, max: 45, group: '36-45' }, 
            { min:45, max: 55, group: '46-55' }, 
            { min:55, max: 65, group: '56-65' }
        ];
        ageGroups.forEach((group) => {
            const filteredData = data.filter(item =>
                parseInt(item.age) > group.min &&
                parseInt(item.age) <= group.max
            );
            const totalTimeSpent = filteredData.reduce((sum, item) => sum + parseInt(item.time_spent), 0);
            ageGroupDataMap[group.group] = { value: totalTimeSpent };
        });
        setAgeGroupTimeSpent(ageGroupDataMap);

        // Calculate Time Spent for each Platform
        const platformDataMap = {};
        data.forEach((row) => {
            const platform = row.platform;
            if (!platformDataMap[platform]) {
                platformDataMap[platform] = { value: 0 };
            }

            platformDataMap[platform].value += parseInt(row.time_spent);
        });
        setPlatformTimeSpent(platformDataMap);

        // Calculate Table Data
        const locations = [...new Set(data.map(item => item.location))];
        const locationData = [];
        locations.forEach((location) => {
            const filteredData = data.filter(item => item.location === location);
            const totalUsers = filteredData.length;
            const totalTimeSpent = filteredData.reduce((sum, item) => sum + parseInt(item.time_spent), 0);
            const inDebt = filteredData.reduce((sum, item) => sum + (item.indebt === 'TRUE' ? 1 : 0), 0);
            const homeOwner = filteredData.reduce((sum, item) => sum + (item.isHomeOwner === 'TRUE' ? 1 : 0), 0);
            const carOwner = filteredData.reduce((sum, item) => sum + (item.Owns_Car === 'TRUE' ? 1 : 0), 0);
            
            locationData.push({
                location: location,
                totalUser: totalUsers,
                timeSpent: totalTimeSpent,
                inDebt: inDebt,
                homeOwner: homeOwner,
                carOwner: carOwner,
            });
        });
        setTableData(locationData);
    }, [data]);

    return (
        <>
            <div className="dashboard-data">
                <div className="first-section">
                    <div className="first-section-data">
                        <Card title={'Total Users'} value={kpiData.totalUsers} />
                        <Card title={'Total Time Spent'} value={`${kpiData.totalTimeSpent} (H)`} />
                        <Card title={'Avg. Age'} value={kpiData.avgAge} />
                        <Card title={`Most Engaged Interest: ${kpiData.topInterestEngagement.interest}`} value={`${kpiData.topInterestEngagement.value} (H)`} />
                    </div>
                </div>

                <div className="second-section">
                    <div className="second-section-data">
                        <Card title={'Avg. Time Spent'} value={`${advancedKPIData.avgTimeSpent} H`} />
                        <Card title={'Avg. Income'} value={`$${advancedKPIData.avgIncome}`} />
                        <Card title={'Users in Debt'} value={`${advancedKPIData.debtUsers}`} />
                        <Card title={'Home or Car Owners'} value={`${advancedKPIData.homeCarOwners}`} />
                    </div>
                </div>

                <div className='third-section'>
                    <div className="third-section-data data">
                        <LineChart dataset={ageGroupTimeSpent}/>
                    </div>

                    <div className="third-section-data data">
                        <DonutChart dataset={platformTimeSpent} />
                    </div>
                </div>

                <div className='fourth-section'>
                    <div className="fourth-section-data data">
                        <table className='table-data'>
                            <thead>
                                <tr>
                                    <th className='first-table-data'>Location</th>
                                    <th>Total Users</th>
                                    <th>Time Spent (H)</th>
                                    <th>In Debt User</th>
                                    <th>Home Owner User</th>
                                    <th>Car Owner User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length > 0 ? (
                                    <>
                                        {tableData.map((row) => (
                                            <tr key={row.location}>
                                                <td className='first-table-data'>{row.location}</td>
                                                <td>{row.totalUser}</td>
                                                <td>{row.timeSpent}</td>
                                                <td>{row.inDebt}</td>
                                                <td>{row.homeOwner}</td>
                                                <td>{row.carOwner}</td>
                                            </tr>
                                        ))}
                                    </>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Analytics;