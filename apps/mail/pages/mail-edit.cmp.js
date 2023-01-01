import { mailService } from "../services/mail-service.js"
import { eventBus } from "../services/event-bus.service.js"
import { storageService } from "../services/async-storage.service.js"

import mailFilter from '../cmps/mail-filter.cmp.js'
// import mailList from '../cmps/mail-list.cmp.js'
// import mailPrev from '../cmps/mail-prev.cmp.js'

import navBar from '../cmps/nav-bar.cmp.js'
import leftHeader from '../cmps/left-header.cmp.js'
import rightHeader from '../cmps/right-header.cmp.js'

export default {
    template: `
        <!-- <section class="mail-edit">
            <h1>Mail Edit</h1>
            <form @submit.prevent="saveClick">
                <input @keyup ="save" ref="to" type="text" v-model="mailToEdit.from">
                <input @keyup ="save" type="text" v-model="mailToEdit.title">
                <button ref="btn">Save</button>
                
            </form>
        </section> -->

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
        <!-- <button ref="btn" @click="setTimer(mailToEdit.id)">set timer</button> -->
<!-- </form> -->


<section class="grid-app-mail">

<header class="">
   <left-header/>
    <div class="right-header">
        <mail-filter />
       <right-header/>
    </div>    
  </header>

  <!-- <section class="mail-edit">
        <form @submit.prevent="saveClick">
            <input @keyup ="save" ref="to" type="text" v-model="mailToEdit.from">
            <input @keyup ="save" type="text" v-model="mailToEdit.title">
            <button ref="btn">Save</button>
            
        </form>
    </section> -->

<section class="mail-content">
    <div class="actions-details">
        <div class="actions-details-new-msg">
            
            <div>
                <span class="new-msg-headline">New Message </span>
            </div>

            <div>
                <router-link to="/mail">
               <span class="close-msg-edit">X</span>
               </router-link>
            </div>
        </div>
    <!-- <section class="mail-edit"> -->
        <form class="flex compose-form sent-mag-compose" @submit="saveClick">
            <input class="form-compose" @keyup ="save" ref="to" type="text" v-model="mailToEdit.from" placeholder="To">
            <input class="title-compose"  @keyup ="save" type="text" v-model="mailToEdit.title" placeholder="Title">
            <input class="msg-compose"  @keyup ="save" type="text" v-model="mailToEdit.msg" >
            
            <div class="flex compose-btns">
                <button class="save" ref="btn"><img src="../../assets/img/send_white_20dp.png"/></button>
            </div>
            
        </form>
        <div class="set-schedule-container">
            <button class="setSchedule" ref="btn" @click="setTimer(mailToEdit.id)"><img src="../../assets/img/schedule_send_white_20dp.png"/></button>
        </div>
                <!-- </section> -->
                
        </section>
            
            <nav-bar :mails="mails"/>





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

            // Sending mail
            if (this.sentMail) {
                storageService.get('mails', this.mailToEdit.id)
                    .then((mail) => {
                        mail.isDraft = false
                        mail.isSent = true
                        if (this.mailSchedule) {
                            this.mailSchedule = false
                            mail.isSchedule = this.mailSchedule
                            // mail.time.date = this.getDayStr
                        }
                        this.mailToEdit.time.date = this.getDayStr

                        mail.time.fullDate = this.timeNow.fullDate
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

            // Draft
            else if (!this.mailToEdit.id || this.mailToEdit.isDraft) {
                this.mailToEdit.isDraft = true
                this.mailToEdit.isSent = false
                this.mailToEdit.time.date = this.getDayStr

                this.mailToEdit.time.fullDate = this.timeNow.fullDate
                mailService.save(this.mailToEdit)
            }

            // Update draft
            else if (this.mailToEdit.id && !this.mailToEdit.isSent) {
                this.mailToEdit.time.date = this.getDayStr
                this.mailToEdit.time.fullDate = this.timeNow.fullDate
                storageService.put('mails', this.mailToEdit)
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
        },

        timeNow() {


            var date = new Date();

            var currentHours = date.getHours()
            currentHours = ("0" + currentHours).slice(-2)
            var currentMinutes = String(date.getMinutes()).padStart(2, '0')
            var currentSeconds = String(date.getSeconds() + 1).padStart(2, '0')
            var time = currentHours + ':' + currentMinutes + ':' + currentSeconds

            var dd = String(date.getDate()).padStart(2, '0')
            var mm = String(date.getMonth()).padStart(2, '0')
            var yyyy = date.getFullYear();

            var today = dd + '/' + mm + '/' + yyyy


            return {
                'fullDate': time + ' , ' + today,
                'date': dd + ',' + mm
            }

            // return { 'fullDate': new Date(), 'date': dd + ',' + mm }

        },
        getDayStr() {

            // todo: put in separate function
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ]
            var date = new Date();

            var mm = monthNames[date.getMonth()].slice(0, 3)
            var dd = String(date.getDate()).padStart(2, '0')
            return mm + '\t' + dd
        }
        // timeSend() {
        //     var date = new Date();
        //     var currentHours = date.getHours();
        //     currentHours = ("0" + currentHours).slice(-2);
        //     var currentMinutes = date.getMinutes();
        //     var currentSeconds = date.getSeconds();
        //     var month = date.getMonth()

        //     var day = date.getDay()

        //     console.log(currentHours, currentMinutes, currentSeconds, month, day);

        // }
    },
    components: {
        mailFilter,
        leftHeader,
        rightHeader,
        navBar
    }
}

