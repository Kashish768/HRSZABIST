const country_URL ="https://psychic-space-bassoon-v6x9g6wrxw62x9wp-6006.app.github.dev/country";
fetch(country_URL).then(response=>{
    if(!response.ok)
        throw new Error("Failed to fetch country DATA");
    return response.json();
}).then(data=>{
    const tbody =document.querySelector("#employeetable")
    data.forEach(employee=>{
        const row = document.createElement("tr");
        row.innerHTML=`
        <td>${employee.country_id}</td>
        <td>${employee.country_name}</td>
        <td>${employee.region_id}</td>
        `;
        tbody.appendChild(row);
    });
}).catch(err=>{
    console.log(err.message);
});