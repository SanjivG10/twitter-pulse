// Function to add extract button to timeline posts and comments

function addExtractButtonToPostsAndComments() {
    const posts = document.querySelectorAll('[data-testid="tweet"]');
    posts.forEach(post => {
      const userElement = post.querySelector('[data-testid="User-Name"]');
      if (userElement && !userElement.querySelector('.extract-icon')) {
        const handle = userElement.querySelector('a').getAttribute('href').slice(1);
        addExtractIcon(userElement,handle);
      }
    });
  }
  
  // Function to add extract button to profile
  function addExtractButtonToProfile() {
    const profileHeader = document.querySelector('[data-testid="UserName"]');
    if (profileHeader && !profileHeader.querySelector('.extract-icon')) {
        const handle = profileHeader?.innerText?.split("\n")?.[1]?.slice(1)??"";
        addExtractIcon(profileHeader,handle);
    }
  }
  
  // Helper function to create and add the extract icon
  function addExtractIcon(element,handle) {
    const icon = document.createElement('span');
    icon.className = 'extract-icon';
    chrome.storage.local.get('profiles', (result) => { 
        const profiles = result?.profiles || {};
        if (profiles[handle]){
            icon.innerHTML="✅";
        }
        else {
            icon.innerHTML="📥";
        }
        icon.addEventListener('click', (e) => {
          e.stopPropagation();
          extractProfile(handle);
        });

        if (!element.querySelector(".extract-icon")){
            element.appendChild(icon);
        }
    });
  }
  
  // Function to extract profile data
  function extractProfile(handle) {
    if (!handle){
        console.log("no handle bro")
    }
    chrome.runtime.sendMessage({action: 'extractProfileFromHandle', handle});
  }
  
 

  // Function to run all update functions
  function updateAll() {
    addExtractButtonToPostsAndComments();
    addExtractButtonToProfile();
  }
  
  // Initial run
  updateAll();
  
  // Set up observer for dynamic content
  const observer = new MutationObserver(updateAll);
  observer.observe(document.body, { childList: true, subtree: true });
