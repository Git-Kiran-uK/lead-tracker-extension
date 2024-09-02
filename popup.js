const leadsEl = document.getElementById('leads-input');
const saveEl = document.getElementById('save');
const saveTabEl = document.getElementById('save-tab');
const deleteEl = document.getElementById('delete');
const recordSectionEl = document.getElementById('record-section');
const recordlistEl = document.getElementById('record-list');
const saveMsgEl = document.getElementById('save-msg');
const tabMsgEl = document.getElementById('tab-msg');
const deleteMsgEl = document.getElementById('delete-msg');

const leads = new Set();

window.onload = function () {
    const storage = localStorage.getItem('leads');
    if (storage) {
        const storedLeads = JSON.parse(storage);
        storedLeads.forEach(v => leads.add(v));
        render(leads);
        if (leads.size > 0) {
            recordSectionEl.style.display = 'flex';
        }
    }
};

function render(values) {
    let recordList = '';
    if((typeof values) === 'string'){
        recordList += `
            <li>
                <a href="${values}" target="_blank">${values}</a>
            </li>
        `;
        recordlistEl.innerHTML += recordList;
    } else {
        for (let value of values) {
            recordList += `
                <li>
                    <a href="${value}" target="_blank">${value}</a>
                </li>
            `;
        }
        recordlistEl.innerHTML = recordList;
    }
}

leadsEl.addEventListener('click', () => {
    saveMsgEl.textContent = "";
    tabMsgEl.textContent = "";
    deleteMsgEl.textContent = "";
})

saveEl.addEventListener('click', () => {
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/;
    let url = leadsEl.value.trim();

    if (leads.has(url)) {
        saveMsgEl.textContent = "The URL is already present in the list.";
    } else if (url && urlRegex.test(url)) {
        leads.add(url);
        render(url);
        leadsEl.value = '';
        recordSectionEl.style.display = 'flex';
        localStorage.setItem('leads', JSON.stringify([...leads]));
    } else {
        saveMsgEl.textContent = 'Enter a valid URL!!';
    }
    saveEl.blur();
});

saveTabEl.addEventListener('click', () => {

    if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            let currentTabUrl = tabs[0].url;

            if (!leads.has(currentTabUrl)) {
                tabMsgEl.textContent = "";
                leads.add(currentTabUrl);
                render(currentTabUrl);
                localStorage.setItem('leads', JSON.stringify([...leads]));
            } else {
                tabMsgEl.textContent = 'The URL is already present in the list.';
            }
        });
    } else {
        tabMsgEl.textContent = 'This feature is only available in Chrome Extensions.';
    }
});

deleteEl.addEventListener('dblclick', () => {
    if (!leads.size) {
        deleteMsgEl.textContent = 'No URL list to delete';
    } else {
        leads.clear();
        recordSectionEl.style.display = 'none';
        render(leads);
        localStorage.removeItem('leads');
    }
    deleteEl.blur();
});