const projectGrid = document.querySelector('#project-grid');
const skillsGrid = document.querySelector('#skills-grid');
const year = document.querySelector('#year');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('#nav-menu');

year.textContent = new Date().getFullYear();

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function renderProjects(projects) {
  projectGrid.innerHTML = projects.map(project => `
    <article class="project-card reveal">
      <div>
        <div class="project-image" role="img" aria-label="${project.title} preview"></div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="tags">
          ${project.tools.map(tool => `<span>${tool}</span>`).join('')}
        </div>
      </div>
      <div class="project-links">
        ${project.live ? `<a href="${project.live}" target="_blank" rel="noreferrer">View Dashboard</a>` : ''}
        ${project.repo ? `<a href="${project.repo}" target="_blank" rel="noreferrer">Repo</a>` : ''}
      </div>
    </article>
  `).join('');
}

function renderSkills(skills) {
  skillsGrid.innerHTML = skills.map(skill => `
    <article class="skill-card reveal">
      <h3>${skill.name}</h3>
      <p>${skill.description}</p>
    </article>
  `).join('');
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

function initTilt() {
  const card = document.querySelector('.tilt-card');
  if (!card || window.matchMedia('(max-width: 720px)').matches) return;

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((y / rect.height) - 0.5) * -10;
    card.style.transform = `rotateX(${rotateX + 8}deg) rotateY(${rotateY - 12}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(8deg) rotateY(-12deg)';
  });
}

Promise.all([
  loadJSON('data/projects.json'),
  loadJSON('data/skills.json')
]).then(([projects, skills]) => {
  renderProjects(projects);
  renderSkills(skills);
  initReveal();
  initTilt();
}).catch(error => {
  console.error(error);
  if (projectGrid) projectGrid.innerHTML = '<p>Project data could not be loaded. Check data/projects.json.</p>';
});
