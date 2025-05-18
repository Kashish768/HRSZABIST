const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());



app.get('/',async(req,res)=>{
    try{
        res.json('Welcome to HR API')

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});

app.get('/~',async(req,res)=>{
    try{
        const result = await pool.query('select * from employees');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/empTotal',async(req,res)=>{
    try{
        const result = await pool.query('select count(employee_id) from employees');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/country',async(req,res)=>{
    try{
        const result = await pool.query('select * from countries');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/o',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT e.employee_id, e.first_name, e.last_name, j.job_title, l.city FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id WHERE l.city = 'Toronto'`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/n',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT e.employee_id, e.first_name, e.last_name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees) AND e.department_id IN (SELECT department_id FROM employees WHERE first_name LIKE '%J%' OR last_name LIKE '%J%'`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/m',async(req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/l',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT e.first_name, e.last_name, e.salary, d.department_id FROM employees e INNER JOIN departments d ON e.department_id = d.department_id WHERE e.salary = (SELECT MIN(salary) FROM employees WHERE department_id = e.department_id)`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});
app.get('/k',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, c.country_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id INNER JOIN countries c ON c.country_id = l.country_id');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
});  
app.get('/j',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, j.job_title, jh.start_date, jh.end_date FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN job_history jh ON j.job_id = jh.job_id WHERE e.commission_pct IS NULL');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/i',async(req,res)=>{
    try{
        const result = await pool.query('SELECT c.country_name, l.city, COUNT(d.department_id) AS number_of_departments FROM countries c INNER JOIN locations l ON c.country_id = l.country_id INNER JOIN departments d ON l.location_id = d.location_id INNER JOIN employees e ON d.department_id = e.department_id GROUP BY c.country_name, l.city HAVING COUNT(e.employee_id) >= 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/ee',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, j.job_title FROM job_history jh INNER JOIN employees e ON e.employee_id = jh.employee_id INNER JOIN jobs j ON j.job_id = jh.job_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 

app.get('/h',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT e.first_name, e.last_name, j.job_title, d.department_name, jh.start_date FROM job_history jh INNER JOIN employees e ON e.employee_id = jh.employee_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN jobs j ON j.job_id = e.job_id WHERE jh.start_date >= '1993-01-01' AND end_date <= '1997-08-31'`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/f',async(req,res)=>{
    try{
        const result = await pool.query('SELECT d.department_id, d.department_name, AVG(e.commission_pct) AS avg_commission_pct, COUNT(e.employee_id) AS employee_count FROM departments d LEFT JOIN employees e ON d.department_id = e.department_id GROUP BY d.department_id, d.department_name');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/e',async(req,res)=>{
    try{
        const result = await pool.query('SELECT j.job_id, j.job_title, SUM(e.salary) AS total_salary FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id GROUP BY j.job_id, j.job_title');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/d',async(req,res)=>{
    try{
        const result = await pool.query('SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/c',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT e.first_name, e.last_name FROM employees e INNER JOIN (SELECT employee_id FROM job_history GROUP BY employee_id HAVING COUNT(employee_id) > 1) jh ON e.employee_id = jh.employee_id`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/b',async(req,res)=>{
    try{
        const result = await pool.query('SELECT employee_id, first_name, last_name FROM employees WHERE department_id IS NULL');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/a',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT e.first_name, e.last_name, e.salary, j.job_title FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id)`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/r',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT d.department_id, d.department_name FROM departments d INNER JOIN employees e ON d.department_id = e.department_id WHERE e.commission_pct < (SELECT AVG(commission_pct) FROM employees)`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/qq',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT d.department_name, l.city FROM departments d INNER JOIN locations l ON d.location_id = l.location_id WHERE city LIKE 'N%'`);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/pp',async(req,res)=>{
    try{
        const result = await pool.query(`SELECT l.street_address, l.city, c.country_id, r.region_name FROM locations l INNER JOIN countries c ON l.country_id = c.country_id INNER JOIN regions r ON c.region_id = r.region_id WHERE r.region_name LIKE 'Asia' limit 2;
           ` );
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/oo',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, j.job_title FROM employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON d.department_id = e.department_id WHERE d.manager_id = e.employee_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/kk',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, m.commission_pct as manager_commission_pct FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN employees m ON d.manager_id = m.employee_id WHERE m.commission_pct > 0.15 limit 3');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 

app.get('/ii',async(req,res)=>{
    try{
        const result = await pool.query('SELECT country_id, country_name, region_id FROM countries WHERE region_id = 1 limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/hh',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, j.job_title, d.department_name, l.city FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/gg',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, j.job_title, d.department_name FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/dd',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, j.job_title, d.department_name, l.city from employees e INNER JOIN jobs j ON e.job_id = j.job_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/bb',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name as employee_first_name, e.last_name as employee_last_name, m.first_name as manager_first_name, m.last_name as manager_last_name, d.department_name, l.city FROM employees e INNER JOIN employees m ON e.manager_id = m.employee_id INNER JOIN departments d ON d.department_id = e.department_id INNER JOIN locations l ON d.location_id = l.location_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/aa',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, d.department_name, l.city, c.country_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON l.location_id = d.location_id INNER JOIN countries c ON c.country_id = l.country_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/cc',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, d.department_name, l.city FROM departments d LEFT JOIN employees e ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/zz',async(req,res)=>{
    try{
        const result = await pool.query('SELECT c.country_name, r.region_name, l.street_address FROM locations l LEFT JOIN countries c ON l.country_id = c.country_id INNER JOIN regions r ON r.region_id = c.region_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/yy',async(req,res)=>{
    try{
        const result = await pool.query('SELECT c.country_name, r.region_name, l.street_address FROM locations l RIGHT JOIN countries c ON c.country_id = l.country_id INNER JOIN regions r ON r.region_id = c.region_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/xx',async(req,res)=>{
    try{
        const result = await pool.query('SELECT l.street_address, l.city, c.country_name, r.region_name FROM locations l INNER JOIN countries c ON l.country_id = c.country_id INNER JOIN regions r ON r.region_id = c.region_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/cc',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, j.job_title, c.country_name FROM job_history jh INNER JOIN employees e ON jh.employee_id = e.employee_id INNER JOIN departments d ON d.department_id = jh.department_id INNER JOIN jobs j ON j.job_id = jh.job_id INNER JOIN locations l ON l.location_id = d.location_id INNER JOIN countries c ON c.country_id = l.country_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/rr',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, j.job_title, l.street_address FROM job_history jh INNER JOIN employees e ON jh.employee_id = e.employee_id INNER JOIN departments d ON d.department_id = jh.department_id INNER JOIN jobs j ON j.job_id = jh.job_id INNER JOIN locations l ON l.location_id = d.location_id limit 2');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/ll',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.first_name, e.last_name, j.job_title, d.department_name FROM job_history jh INNER JOIN employees e ON jh.employee_id = e.employee_id INNER JOIN departments d ON d.department_id = jh.department_id INNER JOIN jobs j ON j.job_id = jh.job_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/mm',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name FROM job_history jh INNER JOIN employees e ON e.employee_id = jh.employee_id INNER JOIN departments d ON d.department_id = jh.department_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/pp',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, c.country_name from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id INNER JOIN countries c ON l.country_id = c.country_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/kk',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name, l.street_address, l.city from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id INNER JOIN departments d ON e.department_id = d.department_id INNER JOIN locations l ON d.location_id = l.location_id limit  5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/rr',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id, d.department_name from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id INNER JOIN departments d ON e.department_id = d.department_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 

app.get('/regionTotal',async(req,res)=>{
    try{
        const result = await pool.query('select count(region_id) from regions');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/regionTotal',async(req,res)=>{
    try{
        const result = await pool.query('select count(region_id) from regions');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 
app.get('/ff',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id from employees e LEFT JOIN job_history jh ON jh.employee_id = e.employee_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 

app.get('/job',async(req,res)=>{
    try{
        const result = await pool.query('SELECT e.employee_id, e.first_name, e.last_name, jh.start_date, jh.end_date, jh.job_id from employees e RIGHT JOIN job_history jh ON jh.employee_id = e.employee_id limit 5');
        res.json(result.rows);

    }catch(err){
        res.status(500).json({Error:err.message});

    }
}); 


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`connect Successfully...on PORT ${PORT}`);
});