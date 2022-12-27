var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 670,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

class myPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
      }
}

var game = new Phaser.Game(config);
var cannonGroup = null;
var npcGroup = null;
var cursors = null;
var ship = null;
var earth = null;

var text = null;
var shield = 0;
var earthHP = 100;
var money = 100;

var scene = null;
var bullets = null;
var laserGroup = [];

function preload ()
{
    this.load.image('earth', 'pictures/earth.png');
    this.load.image('cannon', 'pictures/cannon.png');
    this.load.image('npc', 'pictures/npc.png');
    this.load.image('laser', 'pictures/laser.png');
    this.load.image('laser2', 'pictures/laser2.png');
}

var intervalId = window.setInterval(function(){
    generateNPC();
}, 2000);

var shootintervalId = window.setInterval(function(){
    let speed = 300;
    let dX = 400;
    let dY = 335;

    for (var npc of npcGroup.getChildren()) {
        // create bullet
        let sX = npc.x;
        let sY = npc.y;

        var sPoint = new myPoint(sX,sY);
        var dPoint = new myPoint(dX,dY);

        let bullet = scene.add.image(sX, sY, 'laser').setScale(0.7);
        bullet.angle = Phaser.Math.Angle.BetweenPoints(sPoint, dPoint) * (180/Math.PI);
        scene.physics.add.existing(bullet);
        
        // get Vector where to shoot bullet
        let vector = new Phaser.Math.Vector2( dX - sX, dY - sY);

        // set Speed of bullet 
        vector.setLength(speed);
        
        // Shoot in a straightline
        bullet.body.setAllowGravity(false);
        
        // Destroy the bullet after 1 Second automatically
        setTimeout( () => bullet.destroy(), 1000);
        
        // add bullet to group
        scene.bullets.add(bullet);
        
        bullet.body.setVelocity(vector.x, vector.y);
    }
    }, 3000);

function create ()
{
    scene = this;

    earth = this.physics.add.staticGroup();
    earth.create(400, 370, 'earth').setScale(0.8).refreshBody();

    cannonGroup = this.physics.add.staticGroup();
    cannonGroup.create(500, 350, 'cannon').setScale(0.1).refreshBody();

    npcGroup = this.physics.add.staticGroup();
    npcGroup.create(600, 100, 'npc').setScale(0.3).refreshBody();
    

    text = this.add.text(0, 0, '', { font: '16px Courier', fill: '#00ff00' });
    updateText();
        

    this.input.keyboard.on('keyup-' + 'UP', function() {
        let speed = 500;

        for (var cannon of cannonGroup.getChildren()) {
            // create bullet
            let sX = cannon.x;
            let sY = cannon.y;

            //let sX = 400;
            //let sY = 335;

            console.log(sX);
            console.log(sY);

            //let dX = cannon.x;
            //let dY = cannon.y;

           let dX = 400 + 20;
           let dY = 335;

            var sPoint = new myPoint(sX,sY);
            var dPoint = new myPoint(dX,dY);
    
            let bullet = scene.add.image(sX, sY, 'laser2').setScale(0.7);
            laserGroup.push(bullet);
            bullet.angle = Phaser.Math.Angle.BetweenPoints(sPoint, dPoint) * (180/Math.PI);
            scene.physics.add.existing(bullet);
            
            // get Vector where to shoot bullet
            let vector = new Phaser.Math.Vector2( dX - sX, dY - sY);
    
            // set Speed of bullet 
            vector.setLength(speed);
            
            // Shoot in a straightline
            bullet.body.setAllowGravity(false);
            
            // Destroy the bullet after 1 Second automatically
             setTimeout( () => bullet.destroy(), 2000);
            
            // add bullet to group
            scene.bullets.add(bullet);
            
            bullet.body.setVelocity(vector.x, vector.y);

            for (var npc of npcGroup.getChildren()) {
                scene.physics.add.overlap(bullet,npc,hitNPC,null,this);
            }
            
        }
    });

    this.bullets = scene.add.group();

    cursors = this.input.keyboard.createCursorKeys();
}

function hitNPC(bullet,npc) {
    console.log("Zostrel!");
    bullet.destroy();
    npc.destroy();
    money += 10;
    updateText();
}

function update ()
{
    if (cursors.left.isDown) {
        var point = new myPoint(400,335);
        cannonGroup.rotateAround(point,0.01);
        cannonGroup.rotate(0.01);
        earth.rotate(0.01);
        
    } else if (cursors.right.isDown) {
        var point = new myPoint(400,335);
        cannonGroup.rotateAround(point,-0.01);
        cannonGroup.rotate(-0.01);
        earth.rotate(-0.01);
    }
/*
    for (var laser of laserGroup) {
        for (var npc of npcGroup.getChildren()) {
            scene.physics.add.overlap(laser,npc,hitNPC,null,this);
        }
    }*/

    this.bullets.getChildren().forEach(bullet => {
        if(bullet.x == 400 && bullet.y == 335){
          bullet.destroy();
        }
    })

    /*this.bullets.getChildren().forEach(bullet => {
        if(bullet.x > config.width){
          bullet.destroy();
        }
    })*/

}

function generateNPC() {
    var randX = Math.floor(Math.random() * 741) + 30;
    var randY = 0;

    if (randX <= 170 || randX >= 650 ) {
        randY = Math.floor(Math.random() * 581) + 70;
    } else if (randX >= 150 && randX <= 650) {
        var upDown = Math.floor(Math.random() * 2);
        if (upDown == 0) {
            randY = Math.floor(Math.random() * 31) + 100;
        } else {
            randY = Math.floor(Math.random() * 51) + 590;
        }
    }

    npcGroup.create(randX, randY , 'npc').setScale(0.3).refreshBody();
}

function updateText() {
    text.setText([
        'Štít: ' + shield,
        'Zivot: ' + earthHP,
        'Peniaze: ' + money
    ]);
}