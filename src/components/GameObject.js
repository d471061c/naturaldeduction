class GameObject {
    constructor () {}

    /**
     * Render gameobject to canvas
     * @param {context2d} ctx Context2D
     */
    render(ctx) {}

    /**
     * This method is called in the mainloop.
     */
    update() {}

    /**
     * Handle the event from the event listener
     * @param {EVENT_TYPE} type Type of the event, e.g. mouseMove
     * @param {window.event} event Event from the event listener
     */
    onEvent(type, event) {}
}

export default GameObject