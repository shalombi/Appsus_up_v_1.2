import mailApp from "./mail-app.cmp.js"

export default {
    template: `
        <mail-app :filterByObj="filterByObj"/>
    `,
    data() {
        return {
            filterByObj: {
                bySocial: true
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
