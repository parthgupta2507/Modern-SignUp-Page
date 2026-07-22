(function(){
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const tabIndicator = document.getElementById('tabIndicator');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const heading = document.getElementById('heading');
  const subheading = document.getElementById('subheading');
  const switchLine = document.getElementById('switchLine');
  const switchToSignup = document.getElementById('switchToSignup');
  const formsPanel = document.getElementById('formsPanel');
  const successPanel = document.getElementById('successPanel');
  const successTitle = document.getElementById('successTitle');
  const successText = document.getElementById('successText');
  const successReset = document.getElementById('successReset');

  const copy = {
    login: {
      heading: 'Welcome back',
      subheading: 'Sign in to pick up right where you left off.',
      switchHTML: 'New here? <a href="#" class="link" id="switchToSignup">Create an account</a>'
    },
    signup: {
      heading: 'Create your account',
      subheading: 'Takes less than a minute. No spam, ever.',
      switchHTML: 'Already have an account? <a href="#" class="link" id="switchToLogin">Sign in</a>'
    }
  };

  function bindSwitchLink(){
    const a = switchLine.querySelector('a');
    if(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        setMode(a.id === 'switchToSignup' ? 'signup' : 'login');
      });
    }
  }

  function crossfade(showEl, hideEl){
    hideEl.style.transition = 'opacity 0.18s ease';
    hideEl.style.opacity = '0';
    setTimeout(function(){
      hideEl.hidden = true;
      showEl.hidden = false;
      showEl.style.opacity = '0';
      showEl.style.transform = 'translateY(6px)';
      showEl.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
      requestAnimationFrame(function(){
        showEl.style.opacity = '1';
        showEl.style.transform = 'translateY(0)';
      });
    }, 160);
  }

  function setMode(mode){
    const isLogin = mode === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabSignup.classList.toggle('active', !isLogin);
    tabLogin.setAttribute('aria-selected', isLogin);
    tabSignup.setAttribute('aria-selected', !isLogin);
    tabIndicator.style.transform = isLogin ? 'translateX(0)' : 'translateX(100%)';

    heading.textContent = copy[mode].heading;
    subheading.textContent = copy[mode].subheading;
    switchLine.innerHTML = copy[mode].switchHTML;
    bindSwitchLink();

    if(isLogin){
      crossfade(loginForm, signupForm);
    } else {
      crossfade(signupForm, loginForm);
    }
  }

  tabLogin.addEventListener('click', function(){ setMode('login'); });
  tabSignup.addEventListener('click', function(){ setMode('signup'); });
  bindSwitchLink();

  // Password visibility toggle
  document.querySelectorAll('.toggle-visibility').forEach(function(btn){
    btn.addEventListener('click', function(){
      const target = document.getElementById(btn.dataset.target);
      const isPassword = target.type === 'password';
      target.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.innerHTML = isPassword
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.94 10.94 0 0112 20C5 20 1 12 1 12a19.6 19.6 0 015.06-6.06M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.6 19.6 0 01-3.22 4.34M14.12 14.12a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  });

  // Validation helpers
  function showError(input, errorEl, show){
    input.classList.toggle('has-error', show);
    errorEl.classList.toggle('show', show);
    if(show){
      input.classList.remove('shake');
      void input.offsetWidth;
      input.classList.add('shake');
    }
  }
  function isValidEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  // Password strength
  const strengthBar = document.getElementById('strengthBar');
  const strengthColors = ['#F0876B', '#E8A857', '#E8C857', '#5FD9B4'];
  document.getElementById('signupPassword').addEventListener('input', function(e){
    const v = e.target.value;
    let score = 0;
    if(v.length >= 8) score++;
    if(/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if(/[0-9]/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    const bars = strengthBar.querySelectorAll('span');
    bars.forEach(function(bar, i){
      bar.style.background = i < score ? strengthColors[score - 1] : 'rgba(255,255,255,0.1)';
    });
  });

  function fakeSubmit(btn, onDone){
    btn.classList.add('loading');
    btn.disabled = true;
    setTimeout(function(){
      btn.classList.remove('loading');
      btn.disabled = false;
      onDone();
    }, 900);
  }

  function showSuccess(mode){
    formsPanel.style.transition = 'opacity 0.25s ease';
    formsPanel.style.opacity = '0';
    setTimeout(function(){
      formsPanel.style.display = 'none';
      successTitle.textContent = mode === 'login' ? 'Welcome back' : "You're in";
      successText.textContent = mode === 'login'
        ? 'This was a front-end demo, so no real session was created — but the sign-in flow is fully wired up and ready for your backend.'
        : 'This was a front-end demo, so nothing was actually sent anywhere — but that\'s exactly how the real flow would feel.';
      successPanel.classList.add('show');
      successPanel.style.opacity = '0';
      requestAnimationFrame(function(){
        successPanel.style.transition = 'opacity 0.3s ease';
        successPanel.style.opacity = '1';
      });
    }, 250);
  }

  successReset.addEventListener('click', function(){
    successPanel.style.opacity = '0';
    setTimeout(function(){
      successPanel.classList.remove('show');
      formsPanel.style.display = 'block';
      requestAnimationFrame(function(){
        formsPanel.style.opacity = '1';
      });
    }, 250);
  });

  // Login submit
  loginForm.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const emailErr = document.getElementById('loginEmailError');
    const passErr = document.getElementById('loginPasswordError');

    let valid = true;
    if(!isValidEmail(email.value)){ showError(email, emailErr, true); valid = false; } else { showError(email, emailErr, false); }
    if(password.value.length === 0){ showError(password, passErr, true); valid = false; } else { showError(password, passErr, false); }
    if(!valid) return;

    fakeSubmit(document.getElementById('loginSubmit'), function(){ showSuccess('login'); });
  });

  // Signup submit
  signupForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const nameErr = document.getElementById('signupNameError');
    const emailErr = document.getElementById('signupEmailError');
    const passErr = document.getElementById('signupPasswordError');

    let valid = true;
    if(name.value.trim().length === 0){ showError(name, nameErr, true); valid = false; } else { showError(name, nameErr, false); }
    if(!isValidEmail(email.value)){ showError(email, emailErr, true); valid = false; } else { showError(email, emailErr, false); }
    if(password.value.length < 8){ showError(password, passErr, true); valid = false; } else { showError(password, passErr, false); }
    if(!valid) return;

    fakeSubmit(document.getElementById('signupSubmit'), function(){ showSuccess('signup'); });
  });
})();