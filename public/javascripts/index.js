window.addEventListener("click", (e) => {
    const id = e.target.dataset.id;
    if (e.target.id === 'remBtn') {
        fetch(`/delete/${id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                window.location.href = '/users'
            })
            .catch(err => console.log("Delete request failed:", err));
    }

    if (e.target.id === "editBtn") {
        const body = {
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            age: document.getElementById("age").value,
            email: document.getElementById("email").value
        };
        fetch(`/edit/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(() => window.location.reload())
            .catch(err => console.error("Edit request failed:", err));
    }
})