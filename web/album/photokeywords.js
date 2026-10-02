// Hiding all the ugly code in this file for now. 
import loader from "../lib/loader.js";

const config = {
    onOpenEvent: "onkeyword"
};

const FETCH_POST = {
    method: 'POST',
    cache: 'no-cache'
};

export default class PhotoKeywords {
    constructor(data = config, album = null) {
        this.config = data;
        this.events = {};
        this.album = album;
    }

    async preparePhoto(photo) {
        this.photo = photo;

        let photoKeywords = this;

        document.querySelector("#updateKeywords").open();

        document.querySelector("ph-keyword");

        console.log("KEYWORD UPDATE", photo);
        if (!photo.keywords) {
            let data = await loader(this.config.keywordsUrl + photo.id);
            photo.keywords = data;
            console.log("KEYWORDS", photo.keywords);
        }

        prepareKeywords(photo.keywords);


        document.querySelector("ph-keyword").data = photo.keywords;
        document.querySelector("ph-my-keywords").data = photo.keywords;

        if (!this.events.keywordClick) {
            this.events.keywordClick = document.addEventListener("keywordclick", (ev) => {
                // Handle keyword click event
                console.log("Keyword clicked:", ev.detail.value);
            });
            this.events.saveKeyword = document.addEventListener("savekeyword", async (ev) => {
                // Handle keyword click event
                console.log("Save keyword clicked:", ev.detail.value);
                await photoKeywords.saveKeyword(ev.detail.value);
                photoKeywords.preparePhoto(photoKeywords.photo);
            });
            
            this.events.removeKeyword = document.addEventListener("removekeyword", async (ev) => {
                // Handle keyword click event
                let keyword = ev.detail.value;
                console.log("Remove keyword clicked:", keyword);
                ev.stopPropagation();
                if (keyword !== photoKeywords.album) {
                    await removeKeyword(keyword, photoKeywords.photo);
                    photoKeywords.preparePhoto(photoKeywords.photo);
                } else {
                    let deleteModal = document.querySelector("#deleteKeywordModal");
                    deleteModal.open();
                    let deleteYes = document.querySelector("#deleteKeywordYes");
                    let deleteNo = document.querySelector("#deleteKeywordNo");
                    deleteYes.addEventListener("click", handleDeleteYesClick);
                    deleteNo.addEventListener("click", handleDeleteNoClick);
                    deleteModal.addEventListener("dismiss", removeDeleteListeners);
                    
                    function handleDeleteYesClick() {
                        deleteModal.close();
                        removeKeyword(keyword, photoKeywords.photo);
                        photoKeywords.preparePhoto(photoKeywords.photo);
                        this.dispatchEvent(new CustomEvent('albumkeywordremoved', { detail: photoKeywords.photo, bubbles: true }));
                        removeDeleteListeners();
                    }

                    function handleDeleteNoClick() {
                        deleteModal.close();
                        removeDeleteListeners();
                    }

                    function removeDeleteListeners() {
                        deleteYes.removeEventListener("click", handleDeleteYesClick);
                        deleteNo.removeEventListener("click", handleDeleteNoClick);
                        deleteModal.removeEventListener("dismiss", removeDeleteListeners);
                    }
                }        
            });
        }
    }

    getPhoto() {
        return this.photo;
    }

    async saveKeyword(keyword) {
        if (!this.photo) return;``
        let data = await loader(this.config.saveKeywordUrl + this.photo.id + '?name=' + keyword, FETCH_POST);
        this.photo.keywords = data;
        return data;
    }
}

let keywords = [];
async function prepareKeywords(data = []) {
   let phKeywords = document.querySelector("ph-keywords");
   keywords = await loader('/keywords/all');
   phKeywords.data = reduceKeywords(data);
}


async function removeKeyword(keyword, photo) {
    console.log("Removing keyword from photo:", photo.id, keyword);
    photo.keywords = await updateKeyword('/keywords/unlink/' + photo.id + '?name=' + keyword);
    //postMessage("info", "Removing keyword from photo.", 3);
    //await updateKeyword('/keywords/unlink/' + data.id + '?name=' + detail.value);
    //clearMessage()
}

async function updateKeyword(url) {
    let keywords = await loader(url, FETCH_POST);
    let phKeywords = document.querySelector("ph-keywords");
    phKeywords.data = reduceKeywords(keywords);
    return keywords;
}

function reduceKeywords(data) {
   let existing = data.reduce((acc, item) => {
      acc[item.name] = item.name;
      return acc;
   }, {});
   return keywords.filter(item => !!!existing[item.name]);
}

