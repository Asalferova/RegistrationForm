'use strict';

// Объявление переменных
const formEl = document.forms.myForm;
const progressBar = document.querySelector('.progress');

// Функция для пересчета прогресса заполнения формы
function recalculateProgress() {
    let filledElements = document.forms.myForm.radio.length;
    let radioChecked = false;
    for (let i = 0; i < formEl.elements.length; i++) {
        let element = formEl.elements[i];
        if ((element.type === 'checkbox') && element.checked) {
            filledElements++;
        } else if (element.type === 'select-one' && element.value !== '') {
            filledElements++;
        } else if(element.type === 'radio' && element.checked) {
            radioChecked = true;
            if(radioChecked){
                filledElements++;
            }
        } else if (element.type !== 'radio' && element.type !== 'checkbox' && element.type !== 'select-one' && element.value.trim() !== '') {
            filledElements++;
        }
    }

    let progressValue = (filledElements / formEl.elements.length) * 100;
    progressBar.value = Math.round(progressValue);
};

// Функция для сериализации данных формы
function serializeForm(formNode) {
    const data = new FormData(formNode);
    return data;
};

// Асинхронная функция для отправки данных на сервер
async function sendData(data) {
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: data,
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    return await response.text();
};

// Функция для переключения состояния загрузчика
function toggleLoader() {
    const loader = document.getElementById('loader');
    loader.classList.toggle('hidden');
};

// Функция, выполняемая при успешной отправке данных
function onSuccess(formNode) {
    formNode.classList.toggle('hidden')
};

// Функция для проверки валидности формы
function checkValidity(event) {
    const formNode = event.target.form;
    const isValid = formNode.checkValidity();
    if (!isValid) {
        formNode.querySelectorAll('input, select').forEach(element => {
            if (!element.checkValidity()) {
                element.classList.add('warning');
            } else {
                element.classList.remove('warning');
            }
        });

        const firstInvalidElement = formNode.querySelector('.warning');
        if (firstInvalidElement) {
            firstInvalidElement.focus();
        }
    }
};

// Асинхронная функция для обработки отправки формы
async function handleFormSubmit(event) {
    event.preventDefault();
    const data = serializeForm(event.target);
    toggleLoader();
  
    try {
      const status = await sendData(data);
      if (status === 200) {
        onSuccess(event.target);
      }
    } catch (error) {
      alert('Произошла ошибка при отправке данных, попробуйте позже: ' + error.message);
    } finally {
      toggleLoader();
    }
};

// Добавление обработчиков событий
if(formEl){
    formEl.addEventListener('input', recalculateProgress);
    formEl.addEventListener('change', recalculateProgress);
};

const applicantForm = document.getElementById('my-form');
if(applicantForm){
    applicantForm.addEventListener('submit', checkValidity);
    applicantForm.addEventListener('submit', handleFormSubmit);
};

