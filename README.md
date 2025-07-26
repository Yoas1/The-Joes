<p align="center">
  <img src="assets/logo.png" alt="Just Joe Logo" width="120">
</p>


# 🛠️ The-Joes - Screwed & Nailed

Welcome to The-Joes - Screwed & Nailed, a wildly competitive and mildly chaotic two-player couch co-op game, where Joe and Joe battle in the ultimate race… to fix stuff. 🧯🔌🧰

What started as a joke between friends spiraled into a full-on frenzy of flipping toasters, rewiring ancient kettles, and occasionally tossing a wrench at each other (lovingly, of course).

[Live-Demo](https://yoas1.github.io/The-Joes)


### 🎮 The Setup:
Two Joes. One goal: out-fix the other.

A dusty repair shop filled with broken appliances, bizarre customers, and items that definitely shouldn't be plugged in.

Every repair gets you points. Every mistake? Public humiliation (and maybe a spark or two). ⚡

### 🤹‍♂️ Gameplay Features:
Timed Repair Battles – Fix faster than your rival or risk eternal shame.

Wacky Controls – You think you picked up a screwdriver, but it might be a banana.

Customer Chaos – From grandma’s haunted blender to a sentient coffee machine, requests escalate quickly.

Trash Talk Encouraged – This is a game born from banter.

### 🧠 Why Play?
Because in what other game do you yell “I WAS BORN TO FIX MICROWAVES” while your best friend accidentally sets off a fire extinguisher? Because your friendship deserves a game that lets you bond and bicker at the same time.

#### 🐳 Run with docker:

You can easily run this app using Docker or Docker Compose.

### ▶️ Using Docker

```bash
docker run -p 8080:80 yoas1/the-joes:v0.1
```

### ▶️ Using Docker Compose

Create a `compose.yml` file:

```yaml
version: '3.5'
services:
  the-joes:
    container_name: the-joes
    image: yoas1/the-joes:v0.1
    ports:
      - "8080:80"
```

Then run:

```bash
docker-compose up -d
```
The app will be available at [http://localhost:8080](http://localhost:8080)

