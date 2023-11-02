const voterIdInput = document.querySelector('#voter-id');
const voterId = voterIdInput.value;
const resStatus = document.querySelector('#res-status');
const resMessage = document.querySelector('#res-message');

voterIdInput.addEventListener('change', () => {
  const voterId = voterIdInput.value;
  console.log(JSON.stringify({ voterId }));
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/register-vote');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      console.log(xhr.response);

      resStatus.textContent = 'Success';
      resMessage.textContent = JSON.parse(xhr.response).message;

      resStatus.classList.add('success');
      resStatus.classList.remove('error');
      resMessage.classList.add('success');
      resMessage.classList.remove('error');
    } else {
      console.log(xhr.response);

      resStatus.textContent = 'Error';
      resMessage.textContent = JSON.parse(xhr.response).message;

      resStatus.classList.add('error');
      resStatus.classList.remove('success');
      resMessage.classList.add('error');
      resMessage.classList.remove('success');
    }
  };
  xhr.send(JSON.stringify({ voterId }));
  voterIdInput.value = '';
});
