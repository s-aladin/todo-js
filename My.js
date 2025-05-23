const todoAddButton = document.querySelector('.todo__body_add-button');
const list = document.querySelector('.todo__body-list');
const todo = document.querySelector('.todo');
const select = document.querySelector('.todo__select-item');


let tasks = [];
let editTaskIndex;

function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalForm = document.createElement('form');
    modalForm.classList.add('modal__form');
    modal.appendChild(modalForm);

    const titleInputLabel = document.createElement('label');
    titleInputLabel.setAttribute('for', 'modal__title-input');
    titleInputLabel.classList.add('modal__form-labels');
    titleInputLabel.innerHTML = 'Придумайте краткий заголовок задачи:';
    modalForm.appendChild(titleInputLabel);

    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('maxlength', '30');
    titleInput.setAttribute('name', 'titile');
    titleInput.setAttribute('id', 'modal__title-input');
    titleInput.classList.add('modal__title-input');
    modalForm.appendChild(titleInput);

    const textInputLabel = document.createElement('label');
    textInputLabel.setAttribute('for', 'modal__text-input');
    textInputLabel.classList.add('modal__form-labels');
    textInputLabel.innerHTML = 'Напишите подробное описание задачи:';
    modalForm.appendChild(textInputLabel);

    const textInput = document.createElement('textarea');
    textInput.setAttribute('name', 'text');
    textInput.setAttribute('id', 'modal__text-input');
    textInput.classList.add('modal__text-input');
    modalForm.appendChild(textInput);

    const modalSubmitButton = document.createElement('button');
    modalSubmitButton.setAttribute('name', 'submit');
    modalSubmitButton.setAttribute('type', 'submit');
    modalSubmitButton.classList.add('modal__submit-button');
    modalSubmitButton.innerHTML = 'Добавить задачу';
    modalForm.appendChild(modalSubmitButton);

    document.querySelector('.container-todo').appendChild(modal);
}

function destroyCreatedModal(event) {

    const target = event.target.closest('.modal');

    if (!target && event.target !== todoAddButton && event.target.dataset.action !== 'task-edit') {
        document.querySelector('.modal').remove();
        todo.style.opacity = '1';
    }

    return;
}

function createTaskContent(number, title, text, date) {
    const task = document.createElement('li');
    task.classList.add('task');
    task.setAttribute('data-id', `${number}`);

    const taskNumber = document.createElement('span');
    taskNumber.classList.add('task_number');
    taskNumber.innerHTML = number;
    task.appendChild(taskNumber);

    const taskTitle = document.createElement('h3');
    taskTitle.classList.add('task_title');
    taskTitle.setAttribute('data-action', 'task-show');
    taskTitle.setAttribute('title', 'Развернуть подробное описание задачи');
    taskTitle.innerHTML = title;
    task.appendChild(taskTitle);

    const taskDate = document.createElement('span');
    taskDate.classList.add('task_date');
    taskDate.innerHTML = date;
    task.appendChild(taskDate);

    const taskDoneButton = document.createElement('button');
    taskDoneButton.classList.add('task_done');
    taskDoneButton.setAttribute('type', 'button');
    taskDoneButton.setAttribute('data-action', 'task-done');
    taskDoneButton.setAttribute('title', 'Задача выполнена');
    task.appendChild(taskDoneButton);

    const taskEditButton = document.createElement('button');
    taskEditButton.classList.add('task_edit');
    taskEditButton.setAttribute('type', 'button');
    taskEditButton.setAttribute('data-action', 'task-edit');
    taskEditButton.setAttribute('title', 'Редактировать задачу');
    task.appendChild(taskEditButton);

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.classList.add('task_delete');
    taskDeleteButton.setAttribute('type', 'button');
    taskDeleteButton.setAttribute('data-action', 'task-delete');
    taskDeleteButton.setAttribute('title', 'Удалить задачу');
    task.appendChild(taskDeleteButton);

    const taskText = document.createElement('div');
    taskText.classList.add('task_text');
    task.appendChild(taskText);

    const taskTextContent = document.createElement('p');
    taskTextContent.classList.add('text_content');
    taskTextContent.innerHTML = text;
    taskText.appendChild(taskTextContent);

    list.appendChild(task);
}

function createError() {
    const sortError = document.createElement('span');
    sortError.classList.add('todo__select-error');
    sortError.innerHTML = 'Слишком мало задач для сортировки';

    const selectBlock = document.querySelector('.todo__select');
    selectBlock.appendChild(sortError);
}

function showModal() {
    createModal();

    const modal = document.querySelector('.modal');
    const titleInput = document.querySelector('.modal__title-input');

    todo.style.opacity = '0.5';
    titleInput.focus();

    document.addEventListener('click', destroyCreatedModal);
    modal.addEventListener('submit', addTask);
};

function addTask(e) {
    e.preventDefault();

    const taskData = {};

    let lastNumber = tasks[tasks.length - 1]?.number;

    if (lastNumber === undefined) {
        lastNumber = 0;
    }

    taskData.number = lastNumber + 1;

    taskData.title = document.querySelector('.modal__title-input').value;
    if (taskData.title.trim() === '') {
        taskData.title = 'Заголовок задачи отсутствует';
    }

    taskData.text = document.querySelector('.modal__text-input').value;
    if (taskData.text.trim() === '') {
        taskData.text = 'Подробное описание задачи отсутствует';
    }

    const currentDate = new Date();

    const year = currentDate.getFullYear();

    let month = currentDate.getMonth() + 1;
    if (month <= 9) {
        month = '0' + month;
    }

    let day = currentDate.getDate();
    if (day <= 9) {
        day = '0' + day;
    }

    let hours = currentDate.getHours();
    if (hours <= 9) {
        hours = '0' + hours;
    }

    let minutes = currentDate.getMinutes();
    if (minutes <= 9) {
        minutes = '0' + minutes;
    }

    let seconds = currentDate.getSeconds();
    if (seconds <= 9) {
        seconds = '0' + seconds;
    }

    const date = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

    taskData.dateForSort = currentDate;
    taskData.date = date;
    taskData.done = false;
    taskData.textStatus = 'show';

    tasks.push(taskData);

    createTaskContent(taskData.number, taskData.title, taskData.text, taskData.date);

    document.querySelector('.modal').remove();
    todo.style.opacity = '1';
    console.log(tasks);
};

function taskDelete(e) {
    if (e.target.dataset.action === 'task-delete') {
        const parentNode = e.target.closest('.task');
        const id = parentNode.getAttribute('data-id');

        parentNode.remove();
        tasks.splice(tasks.findIndex(task => task.number == id), 1);

        console.log(tasks);

    }
};

function taskDone(e) {
    if (e.target.dataset.action === 'task-done') {
        const parentNode = e.target.closest('.task');
        const id = parentNode.getAttribute('data-id');

        parentNode.classList.add('completed_task');
        parentNode.lastElementChild.classList.add('done');
        const indexTask = tasks.findIndex(task => task.number == id);
        tasks[indexTask].done = true;

        console.log(tasks);
    }
};

function taskShow(e) {
    if (e.target.dataset.action === 'task-show') {
        const parentNode = e.target.closest('.task');
        const id = parentNode.getAttribute('data-id');

        parentNode.lastElementChild.classList.toggle('hide');

        const indexTask = tasks.findIndex(task => task.number == id);

        if (tasks[indexTask].textStatus === 'show') {
            tasks[indexTask].textStatus = 'hide';
        } else {
            tasks[indexTask].textStatus = 'show';
        }
    }

    console.log(tasks);
};

function taskEdit(e) {
    if (e.target.dataset.action === 'task-edit') {

        createModal();
        todo.style.opacity = '0.5';

        const parentNode = e.target.closest('.task');
        const id = parentNode.getAttribute('data-id');
        parentNode.classList.add('edit');
        editTaskIndex = tasks.findIndex(task => task.number == id);

        let modalTitle = document.querySelector('[for="modal__title-input"]');
        let modalText = document.querySelector('[for="modal__text-input"]');

        modalTitle.innerHTML = 'Новый заголовок задачи:';
        modalText.innerHTML = 'Новое подробное описание задачи:';

        let modalTitleInput = document.querySelector('.modal__title-input');
        let modalTextInput = document.querySelector('.modal__text-input');

        modalTitleInput.value = parentNode.firstElementChild.nextElementSibling.textContent;
        modalTextInput.value = parentNode.lastElementChild.lastElementChild.textContent;

        let modalButton = document.querySelector('.modal__submit-button');
        modalButton.innerHTML = 'Применить изменения';

        const modal = document.querySelector('.modal');

        document.addEventListener('click', destroyCreatedModal);
        modal.addEventListener('submit', taskEditComplete);
    }
};

function taskEditComplete(e) {
    e.preventDefault();

    let titleContent = document.querySelector('.modal__title-input').value;
    let textContent = document.querySelector('.modal__text-input').value;
    const editebleTask = document.querySelector('.edit');

    if (titleContent.trim() === '') {
        titleContent = 'Заголовок задачи отсутствует';
    }

    if (textContent.trim() === '') {
        textContent = 'Подробное описание задачи отсутствует';
    }

    tasks[editTaskIndex].title = titleContent;
    tasks[editTaskIndex].text = textContent;

    editebleTask.firstElementChild.nextElementSibling.innerHTML = titleContent;
    editebleTask.lastElementChild.lastElementChild.innerHTML = textContent;
    editebleTask.classList.remove('edit');

    document.querySelector('.modal').remove();
    todo.style.opacity = '1';
    console.log(tasks);
};

function sortTasks() {

    if (tasks.length < 2) {
        createError();

        setTimeout(() => {document.querySelector('.todo__select-error').remove();}, 1500);
    } else {

        if (this.value == '0') {
            console.log('Фильтр по номеру');
            tasks.sort((a, b) => a.number - b.number);
            console.log(tasks);
        }

        if (this.value == '1') {
            console.log('Фильтр по дате');
            tasks.sort((a, b) => b.dateForSort - a.dateForSort);
            console.log(tasks);
        }

        if (this.value == '2') {
            console.log('Фильтр по заголовку');
            tasks.sort((a, b) => a.title.localeCompare(b.title));
            console.log(tasks);
        }

        if (this.value == '3') {
            console.log('Фильтр по выполненым');
            tasks.sort(function (a, b) { return (a.done === b.done) ? 0 : a.done? -1 : 1});
            console.log(tasks);
        }

        list.innerHTML = '';

        for (let task of tasks) {

            createTaskContent(task.number, task.title, task.text, task.date);

            if (task.done === true) {
                list.lastElementChild.classList.add('completed_task');
                list.lastElementChild.lastElementChild.classList.add('done');
            }

            if (task.textStatus === 'hide') {
                list.lastElementChild.lastElementChild.classList.add('hide');
            }
        }

    }
};


todoAddButton.addEventListener('click', showModal);
list.addEventListener('click', taskDelete);
list.addEventListener('click', taskDone);
list.addEventListener('click', taskShow);
list.addEventListener('click', taskEdit);
select.addEventListener('change', sortTasks);