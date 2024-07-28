function loadCheeses(num_cheese) {
    const cheese_count_id = 'cheese-count';
    const target_id = 'cheese-target';
    const cheese_size = {
        width: 174,
        height: 186
    };
    const cheese_sounds = [];


    if (getCheeseCountElement()) {
        // load cheeses has already been called - just load more cheese to cheese count
        incrementCheeseCount(num_cheese);
        return;
    }
    createCheeseCount();
    createTarget();
    createStyle();
    loadCheeseSounds();
    incrementCheeseCount(num_cheese);
    
    document.addEventListener('mousemove', onmousemove, true);
    getTarget().addEventListener('click', onclick, true);

    function onmousemove(e) {
        const target = getTarget();
        target.style.left = e.clientX - target.width/2 + 'px';
        target.style.top = e.clientY - target.height/2 + 'px';
    }

    function onclick(e) {
        e.preventDefault();
        if (getCheeseCount() > 0) {
            decrementCheeseCount();
            throwCheese(e);
        }
    }

    function throwCheese(e) {
        const cheese = createCheese();
        cheese.style.left = e.pageX - cheese_size.height/2 + 'px';
        cheese.style.top = e.pageY - cheese_size.height/2 + 'px';
    }

    function getCheeseCountElement() {
        return document.getElementById(cheese_count_id);
    }

    function createCheeseCount() {
        const cheese_count = document.createElement('input');
        cheese_count.id = cheese_count_id;
        cheese_count.style.display = 'none';
        cheese_count.setAttribute('type', 'number');
        cheese_count.value = 0;
        document.body.append(cheese_count);
        return cheese_count;
    }

    function getCheeseCount() {
        return Number.parseInt(getCheeseCountElement().value);
    }

    function incrementCheeseCount(inc=1) {
        const old_cheese_count = getCheeseCount();
        const new_cheese_count = old_cheese_count + inc;
        if (old_cheese_count < 1 && new_cheese_count >= 1) {
            cheesesOffEmpty();
        }
        getCheeseCountElement().value = new_cheese_count;
        
    }

    function decrementCheeseCount(dec=1) {
        const old_cheese_count = getCheeseCount();
        const new_cheese_count = old_cheese_count - dec;
        if (old_cheese_count >= 1 && new_cheese_count < 1) {
            cheesesOnEmpty();
        }
        getCheeseCountElement().value = new_cheese_count;
    }

    function createTarget() {
        const target = document.createElement('img');
        target.id = target_id;
        target.src = chrome.runtime.getURL('assets/cheese.png');
        target.style.position = 'fixed';
        target.style.zIndex = 2**32-1;
        target.style.opacity = 0.7;
        target.setAttribute('width', cheese_size.width*0.8);
        target.setAttribute('height', cheese_size.height*0.8);
        target.style.left = '200vw';
        target.style.top = '200vh';
        document.body.append(target);
        return target;
    }

    function getTarget() {
        return document.getElementById(target_id);
    }

    function createCheese() {
        const cheese = document.createElement('img');
        cheese.src = chrome.runtime.getURL('assets/cheese.png');
        cheese.style.position = 'absolute';
        cheese.style.zIndex = 2**32-10000;
        cheese.setAttribute('width', cheese_size.width);
        cheese.setAttribute('height', cheese_size.height);
        cheese.style.left = '100vw';
        cheese.style.top = '0';
        const animation_time = 200;
        cheese.style.animation = 'smack 100ms forwards ease-out';
        setTimeout(playRandomCheeseSound, animation_time/2);
        getTarget().before(cheese); // put cheeses before target
        return cheese;
    }

    function cheesesOnEmpty() {
        getTarget().style.display = 'none';
    }

    function cheesesOffEmpty() {
        getTarget().style.display = '';
    }

    function loadCheeseSounds() {
        const num_cheese_smacks = 12;
        for (let i = 0; i < num_cheese_smacks; i++) {
            cheese_sounds.push(createSound(`cheese_smack${i}.wav`));
        }
    }

    function createSound(filename) {
        const sound = document.createElement('audio');
        sound.src = chrome.runtime.getURL(`assets/${filename}`);
        document.body.append(sound);
        return sound;
    }

    function playRandomCheeseSound() {
        playSound(getRandomArrayElement(cheese_sounds))
    }

    function playSound(sound) {
        if (!sound || !sound.cloneNode)
            return;
        try {
            const audio_clone = sound.cloneNode();
            audio_clone.play();
        } catch {
            // unable to play audio yet
        }
    }

    function getRandomArrayElement(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }

    function createStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
        @keyframes smack {
            from {
                transform: scale(2);
            }
            to {
                transform: scale(1);
            }
        }
        `
        document.head.append(style);
    }
}