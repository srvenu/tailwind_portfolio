const canvas = document.querySelector("#wrapper-canvas");

let dimensions = {
    width: window.innerWidth,
    height: window.innerHeight,
};

Matter.use("matter-attractors");
Matter.use("matter-wrap");

function runMatter() {
    const { Engine, Events, Runner, Render, World, Body, Mouse, MouseConstraint, Common, Bodies } = Matter;

    // Create engine
    const engine = Engine.create();
    engine.world.gravity.y = 0;
    engine.world.gravity.x = 0;
    engine.world.gravity.scale = 0.04;

    // Create renderer with transparent background
    const render = Render.create({
        element: canvas,
        engine: engine,
        options: {
            width: dimensions.width,
            height: dimensions.height,
            wireframes: false,
            background: "transparent",
            pixelRatio: window.devicePixelRatio,
        },
    });

    const runner = Runner.create();

    const world = engine.world;
    world.gravity.scale = 0;

    // Create attractor
    const attractiveBody = Bodies.circle(
        render.options.width / 2,
        render.options.height / 2,
        Math.max(dimensions.width / 25, dimensions.height / 25) / 2,
        {
            render: {
                fillStyle: 'rgba(0, 0, 0, 0.3)', // Reduced opacity
                strokeStyle: 'rgba(30, 30, 30, 0.4)',
                lineWidth: 1,
            },
            isStatic: true,
            plugin: {
                attractors: [
                    (bodyA, bodyB) => ({
                        x: (bodyA.position.x - bodyB.position.x) * 1e-6,
                        y: (bodyA.position.y - bodyB.position.y) * 1e-6,
                    }),
                ],
            },
        }
    );

    World.add(world, attractiveBody);

    // Professional muted color palette
    const darkModeColors = [
        'rgba(64, 224, 208, 0.5)', // Turquoise
        'rgba(72, 209, 204, 0.5)', // Medium turquoise
        'rgba(100, 149, 237, 0.5)', // Cornflower blue
        'rgba(176, 224, 230, 0.5)', // Powder blue
    ];
    const lightModeColors = [
        'rgba(70, 130, 180, 0.5)', // Steel blue
        'rgba(135, 206, 250, 0.5)', // Light sky blue
        'rgba(173, 216, 230, 0.5)', // Light blue
        'rgba(240, 248, 255, 0.5)', // Alice blue
    ];

    const colors = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkModeColors
        : lightModeColors;

    // 👉 Further reduced particle count for better performance
    const particleCount = window.innerWidth < 768 ? 15 : 40;

    for (let i = 0; i < particleCount; i++) {
        let x = Common.random(0, render.options.width);
        let y = Common.random(0, render.options.height);
        let size = Common.random(8, 20); // Smaller particles for smoother movement
        let sides = Common.random(3, 6);
        const fillColor = colors[Math.floor(Common.random(0, colors.length))];

        const body = Bodies.polygon(x, y, sides, size, {
            mass: size / 40, // ✅ Lower mass for better response
            friction: 0.02,
            frictionAir: 0.01, // ✅ Lower friction for smoother response
            angle: Math.round(Math.random() * 360),
            render: {
                fillStyle: fillColor,
                strokeStyle: 'rgba(30, 30, 30, 0.3)',
                lineWidth: 1,
            },
        });

        World.add(world, body);
    }

    // ✅ Add mouse and touch support using MouseConstraint
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.1,
            render: {
                visible: false,
            },
        },
    });

    World.add(world, mouseConstraint);

    // ✅ Throttle mouse movement using requestAnimationFrame
    let lastMouseMove = 0;
    Events.on(engine, "afterUpdate", () => {
        const now = Date.now();
        if (now - lastMouseMove > 16) { // ≈60fps
            if (mouse.position.x) {
                Body.translate(attractiveBody, {
                    x: (mouse.position.x - attractiveBody.position.x) * 0.04, // ✅ Smaller step size for smoother animation
                    y: (mouse.position.y - attractiveBody.position.y) * 0.04,
                });
            }
            lastMouseMove = now;
        }
    });

    // ✅ Fix canvas resizing issue
    function setWindowSize() {
        dimensions.width = window.innerWidth;
        dimensions.height = window.innerHeight;
        render.canvas.width = dimensions.width;
        render.canvas.height = dimensions.height;
        render.options.width = dimensions.width;
        render.options.height = dimensions.height;
    }

    window.addEventListener('resize', debounce(setWindowSize, 200));

    // Control functions
    const data = {
        engine,
        runner,
        render,
        stop: () => {
            Render.stop(render);
            Runner.stop(runner);
        },
        play: () => {
            Runner.run(runner, engine);
            Render.run(render);
        },
    };

    Runner.run(runner, engine);
    Render.run(render);
    return data;
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

// ✅ Make sure canvas fills the screen
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';

let m = runMatter();

