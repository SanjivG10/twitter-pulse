
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "scrapeProfile") {
        waitForElement('[data-testid="UserName"]',request.tabId);
    }
});
  
  function scrapeProfile() {
    const userNameElement = document.querySelector('[data-testid="UserName"]');
    if (!userNameElement) {
      console.log("UserName element not found");
      return null;
    }

    const [userName,handle] = userNameElement?.innerText?.split("\n")??[]

      const followCounts = document.querySelectorAll('a[href$="/verified_followers"], a[href$="/following"]');
      const bio = document.querySelector('[data-testid="UserDescription"]')?.textContent || '';

      let followersCount = '0';
      let followingCount = '0';
      followCounts.forEach(count => {
          const text = count.textContent;
          if (text.includes('Followers')) {
              followersCount = text.split(' ')[0];
          } else if (text.includes('Following')) {
              followingCount = text.split(' ')[0];
          }
      });

      const websiteElement = document.querySelector('[data-testid="UserUrl"]');
      const website = websiteElement ? websiteElement.textContent.trim() : '';

      const locationElement = document.querySelector('[data-testid="UserLocation"]');
      const location = locationElement ? locationElement.textContent.trim() : '';


    const joinDateElement = document.querySelector('[data-testid="UserJoinDate"]');
    const joinDate = joinDateElement ? joinDateElement.textContent.replace('Joined', '').trim() : '';

    const emails = bio.match(/[\w\.-]+@[\w\.-]+\.\w+/g) || [];
    const isVerified = !!userNameElement.querySelector('svg[aria-label="Verified account"]');

    return {
      userName,
      handle,
      bio,
      followingCount,
      followersCount,
      emails,
      isVerified,
      joinDate,
      website,
      location,
      scrappedDate: Date.now(),
    };
}
  function waitForElement(selector,tabId) {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver((mutationsList, observer) => {
        const userNameElement = document.querySelector(selector);
        if (userNameElement) {
            const profileData = scrapeProfile();
            if (profileData) {
                saveProfile(profileData);
            }

            chrome.runtime.sendMessage({action: 'closeTab', tabId,data:profileData});
            observer.disconnect(); 
        }
    });

    observer.observe(targetNode, config);
}

function saveProfile(data) {
    chrome.storage.local.get('profiles', (result) => {
      const profiles = result.profiles || {};
      const handle = data.handle.slice(1);
      profiles[handle] = data;
      chrome.storage.local.set({profiles})
    });
}