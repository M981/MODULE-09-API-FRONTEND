const apiUrl = 'http://localhost/module-09-api/api.php';

// Functie om in te loggen met de ingevoerde gebruikersnaam
async function login() {
    var username = document.getElementById('usernameInput').value;
    if (username.trim() !== '') {
        try {
            document.getElementById('login').style.display = 'none';
            document.getElementById('todoApp').style.display = 'block';
            
            await fetchTasks();
        } catch (error) {
            console.error('Error:', error);
            alert('Er is een fout opgetreden bij het inloggen.');
        }
    } else {
        alert('Voer alstublieft een gebruikersnaam in.');
    }
}

async function fetchTasks() {
    try {
        const response = await fetch(`${apiUrl}?action=getTasks`);
        if (!response.ok) {
            throw new Error('Er is een fout opgetreden bij het ophalen van de taken.');
        }
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

async function addTask() {
    var taskInput = document.getElementById('taskInput');
    var task = taskInput.value.trim();
    if (task !== '') {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `action=addTask&task=${encodeURIComponent(task)}&startdate=${encodeURIComponent(new Date().toISOString())}&enddate=${encodeURIComponent(new Date().toISOString())}&user_id=1`
            });
            if (!response.ok) {
                throw new Error('Er is een fout opgetreden bij het toevoegen van de taak.');
            }
            await fetchTasks();
            taskInput.value = ''; 
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    } else {
        alert('Voer alstublieft een taak in.');
    }
}

async function markAsDone(taskElement, taskId) {
    if (!taskElement.classList.contains('done')) {
        taskElement.classList.add('done'); 
        console.log('Task ID:', taskId); 

        try {
            const response = await fetch(`${apiUrl}?action=updateTask&id=${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id=${taskId}` 
            });
            if (!response.ok) {
                throw new Error('Er is een fout opgetreden bij het markeren van de taak als voltooid.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    } else {
        alert('Deze taak is al voltooid en kan niet worden teruggedraaid.');
    }
}

function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; 
    if (Array.isArray(tasks)) { 
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.task;
            li.dataset.taskId = task.id; 
            li.addEventListener('click', () => markAsDone(li, task.id)); 
            if (task.done == 1) { 
                li.classList.add('done');
            }
            taskList.appendChild(li);
        });
    } else {
        taskList.innerHTML = '<li>Geen taken gevonden</li>';
    }
}
