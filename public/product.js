document.getElementById('specsForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var specsName = document.getElementById('specsNameInput').value;
    console.log(specsName);
    // Create an XMLHttpRequest object
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveSpecs', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // Specs creation successful
                console.log("Specs created successfully");
                alert('Specs created successfully');
                fetchAndDisplaySpecs();
            } else {
                console.log(specsName);
                alert('Error creating Specs');
                console.log(specsName);
            }
        }
    };
    xhr.send(JSON.stringify({ specsName: specsName }));
    console.log("Specs Name:", specsName);
});

function fetchAndDisplaySpecs() {
    fetch('/getSpecs')
        .then(response => response.json())
        .then(specs => {

            const specsDisplayContainer = document.querySelector('.row2c2');
            specsDisplayContainer.innerHTML = '';

            specs.forEach(spec => {

                const specContainer = document.createElement('div');
                specContainer.className = 'specsDisplay';

                const specNameElement = document.createElement('p');
                specNameElement.textContent = `${spec.spec_name}`;

                const editButton = document.createElement('button');
                editButton.className = 'editButton';
                editButton.addEventListener('click', function() {

                    const editForm = document.createElement('form');
                    editForm.id = 'editSpecForm';
                    editForm.innerHTML = `
                        <input type="text" id="editSpecName" name="editSpecName" value="${spec.spec_name}" required>
                        <button type="submit">Save</button>
                    `;
                
                    specContainer.innerHTML = '';
                    specContainer.appendChild(editForm);
                
                    editForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        const updatedSpecName = document.getElementById('editSpecName').value;
                        updateSpecInDatabase(spec.id, updatedSpecName);
                        fetchAndDisplaySpecs();
                    });
                });

                const deleteButton = document.createElement('button');
                deleteButton.className = 'deleteButton';

                deleteButton.addEventListener('click', function() {
                    if (!confirm('Are you sure you want to delete this spec?')) {
                        return;
                    }

                    deleteSpecFromDatabase(spec.id);
                    fetchAndDisplaySpecs();
                });
                specContainer.appendChild(specNameElement);
                specContainer.appendChild(editButton);
                specContainer.appendChild(deleteButton);
                specsDisplayContainer.appendChild(specContainer);
            });
        })
        .catch(error => console.error('Error fetching specs:', error));
}

function deleteSpecFromDatabase(specId) {
    fetch(`/deleteSpec/${specId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Spec deleted successfully');
    })
    .catch(error => console.error('Error deleting spec:', error));
}


function updateSpecInDatabase(specId, updatedSpecName) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/updateSpec', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Spec updated successfully");
            } else {
                console.error('Error updating spec:', xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify({ id: specId, name: updatedSpecName }));
}

document.addEventListener('DOMContentLoaded', fetchAndDisplaySpecs);