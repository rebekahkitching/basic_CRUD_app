const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', () => {
    return fetch('/quotes', {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
            name: 'Data',
            quote: 'Could you please continue the petty bickering? I find it most intriguing.'
        })
    })
    .then(res => {
        if(res.status === 200){
            window.location.reload(true)
            return;
        } 

        if (res.status === 400) {
            messageDiv.textContent = "something messed up"
            return;
        }

        throw new Error("something bad happend unexpected")
    })
    
})

deleteButton.addEventListener('click', () => {
    return fetch('/quotes', {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'Data'
        })
    })
    .then(res => {
        if (res.status === 200) {
            window.location.reload(true)
            return;
        }
        if (res.status === 404) {
            messageDiv.textContent = 'No Data quotes to delete'
            return;
        }

        throw new Error("something bad happened replace this later")
    })
    .catch(console.error)
})