document.getElementById('viewProfiles').addEventListener('click', viewProfiles);
document.getElementById('exportProfiles').addEventListener('click', exportProfiles);
document.getElementById('clearStorage').addEventListener('click', clearStorage);


function viewProfiles() {
  chrome.storage.local.get('profiles', (result) => {
    const profiles = result.profiles || {};
    const profileList = document.getElementById('profileList');
    profileList.innerHTML = '';
    
    Object.values(profiles).forEach(profile => {
      const profileDiv = document.createElement('div');
      profileDiv.className = 'profile-item';
      profileDiv.innerHTML = `
        <h3>${profile.userName}</h3>
        <h3>${profile.handle}</h3>
        <p>${profile.bio}</p>
        <p>Following: ${profile.followingCount}</p>
        <p>Followers: ${profile.followersCount}</p>
      `;
      profileList.appendChild(profileDiv);
    });
  });
}

function exportProfiles() {
  chrome.storage.local.get('profiles', (result) => {
    const profiles = result.profiles || {};
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "twitter_profiles.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });
}

function clearStorage() {
  chrome.storage.local.clear(() => {
    console.log('Storage cleared');
    document.getElementById('profileList').innerHTML = '';
    alert("Cleared storage");
  });
}

