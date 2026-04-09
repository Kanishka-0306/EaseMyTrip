// ====== FOOTER ======
import footer from '../footer/footer.js';
let footerPlace = document.querySelector('#placeFooter');
footerPlace.innerHTML = footer();

// ====== FLIGHT DATA PLACEMENT ======
import flight from '../component/flightData.js';
let count = 0;
flight.forEach((element) => {
    let container = count % 2 === 0 ? document.querySelector('.tab-content-lft') : document.querySelector('.tab-content-rit');
    if (!container || count === 10) return;

    let ul = document.createElement('ul');
    let li1 = document.createElement('li');
    li1.innerText = element;

    let li2 = document.createElement('li');
    let a = document.createElement('a');
    a.innerText = 'search flight';
    a.setAttribute('class', 'srch_btn');
    li2.appendChild(a);

    ul.append(li1, li2);
    container.appendChild(ul);
    count++;
});

// ====== SIGNUP/PASSWORD POPUP ======
import { signUpHtml, passwordHtml } from '../signup/signup.js';
document.querySelector('.placingSignUp').innerHTML = signUpHtml();
document.querySelector('.placingSignUpPass').innerHTML = passwordHtml();

// ====== SHOW/HIDE POPUPS ======
document.querySelector('#popUp')?.addEventListener('click', () => {
    document.querySelector('.bg-modal-signup').style.display = 'flex';
});
document.querySelector('#close-sign-up-form')?.addEventListener('click', () => {
    document.querySelector('.bg-modal-signup').style.display = 'none';
});
document.querySelector('#close-pass-up-form')?.addEventListener('click', () => {
    document.querySelector('.bg-modal-password').style.display = 'none';
});

// ====== CHANGE CONTINUE BUTTON COLOR ======
document.querySelector('#form-signIn-email')?.addEventListener('input', () => {
    document.querySelector('.signupContinue').style.backgroundColor =
        document.querySelector('#form-signIn-email').value === '' ? 'rgba(0,0,0,.25)' : '#EF6614';
});

// ====== LOGIN/SIGNUP FLOW ======
let emailVal = '';
document.querySelector('#emailForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    emailVal = document.querySelector('#form-signIn-email').value;

    let registerDetail = { email: emailVal, password: '' };
    let detailOfSignIn = { email: emailVal, password: '', isCorrect: false };
    localStorage.setItem('signUp', JSON.stringify([detailOfSignIn]));

    if (!localStorage.getItem('registerCandidateData')) {
        localStorage.setItem('registerCandidateData', JSON.stringify([]));
    }
    let registerObject = JSON.parse(localStorage.getItem('registerCandidateData'));
    if (!registerObject.some(el => el.email === emailVal)) {
        registerObject.push(registerDetail);
    }
    localStorage.setItem('registerCandidateData', JSON.stringify(registerObject));

    document.querySelector('.bg-modal-signup').style.display = 'none';
    document.querySelector('.bg-modal-password').style.display = 'flex';
});

// ====== BACK TO SIGNUP ======
document.querySelector('.fa-arrow-left')?.addEventListener('click', () => {
    document.querySelector('.bg-modal-password').style.display = 'none';
    document.querySelector('.bg-modal-signup').style.display = 'flex';
});

// ====== PASSWORD INPUT COLOR ======
document.querySelector('#form-signIn-password')?.addEventListener('input', () => {
    let login = document.querySelector('.login');
    login.style.backgroundColor =
        document.querySelector('#form-signIn-password').value === '' ? 'rgba(0,0,0,.25)' : '#EF6614';
});

// ====== PASSWORD FORM SUBMIT ======
document.querySelector('#passwordForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let passwordVal = document.querySelector('#form-signIn-password').value;
    let registerObject = JSON.parse(localStorage.getItem('registerCandidateData'));
    let signUp = JSON.parse(localStorage.getItem('signUp'));

    if (signUp[0].password === '') {
        registerObject.forEach((element) => {
            if (element.email === signUp[0].email) {
                element.password = passwordVal;
                signUp[0].password = passwordVal;
                signUp[0].isCorrect = true;
            }
        });
        localStorage.setItem('registerCandidateData', JSON.stringify(registerObject));
        if (signUp[0].isCorrect) {
            localStorage.setItem('signUp', JSON.stringify(signUp));
            showLoginUser(); // update UI
            window.location.href = './index.html'; // redirect
        }
    }
});

// ====== LOGIN / LOGOUT DISPLAY ======
function showLoginUser() {
    let div = document.querySelector('#signupLogin');
    let signUpData = JSON.parse(localStorage.getItem('signUp'));

    if (signUpData && signUpData[0].isCorrect) {
        div.innerHTML = `Hi, ${signUpData[0].email} <button id="logoutBtn">Logout</button>`;
        div.style.padding = '5px';
        div.style.fontSize = '12px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '10px';

        // ===== Embedded CSS for Logout Button =====
        let logoutBtn = document.querySelector('#logoutBtn');
        logoutBtn.style.backgroundColor = '#EF6614';
        logoutBtn.style.color = 'white';
        logoutBtn.style.border = 'none';
        logoutBtn.style.padding = '5px 12px';
        logoutBtn.style.borderRadius = '5px';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.fontSize = '12px';
        logoutBtn.style.transition = 'background-color 0.3s';

        logoutBtn.addEventListener('mouseover', () => {
            logoutBtn.style.backgroundColor = '#d8550f';
        });
        logoutBtn.addEventListener('mouseout', () => {
            logoutBtn.style.backgroundColor = '#EF6614';
        });
    } else {
        // Restore original Login / Signup
        div.innerHTML = `<span id="popUp">Login / Signup</span>`;
        div.style.padding = '';
        div.style.fontSize = '';
        document.querySelector('#popUp')?.addEventListener('click', () => {
            document.querySelector('.bg-modal-signup').style.display = 'flex';
        });
    }
}

// ====== LOGOUT ======
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'logoutBtn') {
        let signUpData = JSON.parse(localStorage.getItem('signUp'));
        signUpData[0].isCorrect = false;
        signUpData[0].email = '';
        signUpData[0].password = '';
        localStorage.setItem('signUp', JSON.stringify(signUpData));
        showLoginUser();
    }
});

// ====== INITIAL CALL ======
showLoginUser();
