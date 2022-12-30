import { mailService } from "../services/mail-service.js"
import { eventBus } from "../services/event-bus.service.js"
import { storageService } from "../services/async-storage.service.js"

export default {
    template: `
        <section class="mail-edit">
            <h1>Mail Edit</h1>
            <form @submit.prevent="saveClick">
                <input @keyup ="save" ref="to" type="text" v-model="mailToEdit.from">
                <input @keyup ="save" type="text" v-model="mailToEdit.title">
                <button ref="btn">Save</button>
                
            </form>
        </section>

        <!-- <form> -->
        <!-- <fieldset>
            <select v-model.number="selectedTime" multiple> 
                <option value=10000>10 sec</option> 
                <option value=20000>20 sec</option> 
                <option value=30000>30 sec</option>
            </select>
        </fieldset>
       <pre>{{selectedTime}}</pre>
        -->
        <button ref="btn" @click="setTimer(mailToEdit.id)">set timer</button>
<!-- </form> -->

    `,
    data() {
        return {
            mailToEdit: null,
            sentMail: null,
            mailSchedule: null,
            time: null,
        }
    },
    created() {
        this.mailToEdit = mailService.getEmptyMail()

    },
    mounted() {
        this.$refs.to.focus()
    },
    methods: {
        saveClick() {

            this.sentMail = true
            // if (this.mailSchedule) this.isSchedule = this.mailSchedule
            this.save()
            // storageService.get('mails', this.mailToEdit.id)
            //     .then((mail) => {
            //         mail.isDraft = false
            //         mail.isSent = true
            //         return mail
            //     })
            //     .then((mail) => {
            //         storageService.put('mails', mail)
            //         console.log(mail, 'mail')
            //         return mail
            //     })
            //     // .then(() => {
            //         // mailService.query()
            //             // .then(mails => {
            //                 // console.log('load');
            //                 // console.log(mails)
            //                 // this.mails = mails
            //                 // return mails
            //             // })
            //     // })
            //     .then(() => {
            //         this.$router.push('/mail')
            //     })
        },
        save() {

            // console.log('><><><', this.mailToEdit)
            if (this.sentMail) {
                console.log('A')
                storageService.get('mails', this.mailToEdit.id)
                    .then((mail) => {
                        mail.isDraft = false
                        mail.isSent = true
                        if (this.mailSchedule) {
                            this.mailSchedule = false
                            mail.isSchedule = this.mailSchedule
                        }

                        return mail
                    })
                    .then((mail) => {

                        storageService.put('mails', mail)
                        return mail
                    })

                    .then(() => {
                        setTimeout(() => {
                            this.$router.push('/mail')
                        }, 40)
                    })
            }

            else if (!this.mailToEdit.id || this.mailToEdit.isDraft) {
                console.log('B')
                this.mailToEdit.isDraft = true

                // if (!this.mailSchedule)  this.mailToEdit.isDraft = true
                // else {

                //     this.mailToEdit.isDraft = false
                //     this.mailToEdit.isSchedule = true
                // }

                this.mailToEdit.isSent = false
                mailService.save(this.mailToEdit)
            }
            else if (this.mailToEdit.id && !this.mailToEdit.isSent) {
                console.log('C')

                // storageService.get('mails', this.mailToEdit.id)
                // .then((mail) => {
                // this.mailToEdit.isDraft = true
                // this.mailToEdit.isSent = false
                storageService.put('mails', this.mailToEdit)
                // })
            }
            return
        },
        setTimer(mailId) {
            console.log(mailId);
            // this.$router.push('/mail')
            // TODO: make variable to not call this this.$router.push('/mail') row twice
            // return new Promise(() => {
            // setTimeout(resolve, 5000)
            //  new Promise((resolve) => {



            // mailService.get(mailId)
            // .then((mail) => {
            this.mailSchedule = true
            // mailToEdit.isSchedule = this.mailSchedule
            // this.mailToEdit =  mail
            //     return mail
            // })


            storageService.get('mails', this.mailToEdit.id)
                .then((mail) => {
                    mail.isDraft = false
                    // if (this.mailSchedule) {
                    // this.mailSchedule = false
                    mail.isSchedule = this.mailSchedule
                    // }

                    return mail
                })
                .then((mail) => {

                    storageService.put('mails', mail)
                    return mail
                })


                // setTimeout(this.saveClick, 5000)
                // setTimeout(() => {
                //     this.$router.push('/mail/sent')
                // }, 5000);

                // eventBus.emit('schedule', 5000)
                // this.$router.push('/mail')

                // })


                .then((mail) => {
                    this.time = +prompt('enter time for schedule (in seconds)') * 1000

                    // return new Promise((mail) => {
                    // mail.isSchedule=true

                    setTimeout(this.saveClick, this.time)

                    // setTimeout(() => {
                    //     this.$router.push('/mail/sent')
                    // }, 5000)
                    setTimeout(() => {

                        this.$router.push('/mail/schedule')
                    }, 100);
                    // this.$router.push('/mail')


                    eventBus.emit('scheduleMsg', this.time)

                })
            // .then(() => {
            //     setTimeout(() => {
            //         this.$router.push('/mail')
            //     }, 6000);
            // })


            // })



            // })
            // .then(() => {
            //     return new Promise(() => {
            //         setTimeout(this.saveClick, 5000)
            //     })
            // })

            // console.log('timer')
            // setTimeout(() => {
            //     this.saveClick()
            // }, 5000)

            // setTimeout(() => {
            //     this.$router.push('/mail')
            // }, 5500);




            // Promise.resolve(this.saveClick())
            //     .then(() => {
            //         storageService.put('mails', this.mailToEdit)
            //     })

        },
        // wait(time) {
        //     return new Promise((resolve) => {
        //         setTimeout(resolve, time)
        //     })
        // }
    },
    computed: {
        promptTimeToSec() {
            return this.time / 1000
        }
    }
}

