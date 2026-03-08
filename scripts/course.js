const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]

const webCertificatesList = document.getElementById('web-certificates-list');
const courseFilters = document.getElementById('course-filters');
const creditsCountEl = document.getElementById('credits-count');

function createCourseCard(course) {
    const article = document.createElement('article');
    article.classList.add('course-card', course.completed ? 'completed' : 'incomplete');
    article.setAttribute('role', 'group');
    article.setAttribute('aria-label', `${course.subject} ${course.number} - ${course.title}`);
    article.innerHTML = `
        <h3 class="course-title">${course.subject} ${course.number}</h3>
    `;
    return article;
}

function renderCourses(list) {
    if (!webCertificatesList) return;
    webCertificatesList.innerHTML = '';
    // Update total credits for the currently displayed list using reduce
    const totalCredits = list.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
    if (creditsCountEl) creditsCountEl.textContent = totalCredits;

    if (list.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'No courses found.';
        webCertificatesList.appendChild(p);
        return;
    }

    list.forEach(course => webCertificatesList.appendChild(createCourseCard(course)));
}

function setActiveButton(subject) {
    if (!courseFilters) return;
    const buttons = courseFilters.querySelectorAll('button[data-subject]');
    buttons.forEach(btn => {
        const isActive = btn.dataset.subject === subject;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function applyFilter(subject) {
    const filtered = subject === 'ALL' ? courses : courses.filter(c => c.subject === subject);
    renderCourses(filtered);
    setActiveButton(subject);
}

if (!webCertificatesList) {
    console.warn('Elemento #web-certificates-list não encontrado no DOM.');
} else {
    // Delegated click handler for filter buttons (works even if buttons are added later)
    if (courseFilters) {
        courseFilters.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-subject]');
            if (!btn) return;
            applyFilter(btn.dataset.subject);
        });
    } else {
        console.warn('Elemento #course-filters não encontrado no DOM.');
    }

    // Initial render: show all courses
    applyFilter('ALL');
}
