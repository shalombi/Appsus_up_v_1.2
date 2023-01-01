import mailApp from "./mail-app.cmp.js"

export default {
    template: `
        <mail-app :filterByObj="filterByObj"/>
    `,
    data() {
        return {
            filterByObj: {
                byPromotion: true
            }
        }
    },
    created() {
    },
    methods: {
    },
    components: {
        mailApp
    }
}
