import { storageService } from '../services/async-storage.service.js'
import { mailService } from '../services/mail-service.js'
import { eventBus } from '../services/event-bus.service.js'

import mailFilter from '../cmps/mail-filter.cmp.js'
import mailList from '../cmps/mail-list.cmp.js'

import navBar from '../cmps/nav-bar.cmp.js'

import mailPrev from '../cmps/mail-prev.cmp.js'
import leftHeader from '../cmps/left-header.cmp.js'
import rightHeader from '../cmps/right-header.cmp.js'
// import mailEdit from './mail-edit.cmp.js'

export default {
    props: ["filterByObj"],
    template: `
    <section class="grid-app-mail">

        <header class="">
           <left-header/>
            <div class="right-header">
                <mail-filter v-if="mails" @filter="filter"/>
               <right-header/>
            </div>    
          </header>

          <nav-bar :mails="mails"/>
                
              

        <main>
            <!-- Main -->
            <div class="head-actions flex space-between">

                <div class="flex main-action-left">
                   <!-- <button class="nonebcc">  -->
                    <div class="flex select">
                        <img @click="removeSelected" class="main-action cursor-pointer select" :class="deleteMainStyle"  src="../../assets/img/delete_white_20dp.png"/>
                        <img  @click="print" class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/arrow_drop_down_white_20dp.png"/>
                    </div>
                    <div class="flex ref-more-act">
                        <img class="main-action cursor-pointer"  src="../../assets/img/actions-main-cmp/refresh.png"/>
                        <img  class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/more_vert.png"/>
                    </div>
                </div>
                


                <div class="flex main-action-right">
                    <span class="mail-to-display">1-14 of 14</span>
                    <img  class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/chevron_left.png"/>
                    <img  class="main-action cursor-pointer" src="../../assets/img/actions-main-cmp/chevron_right_white_20dp.png"/>
                </div>

            </div>

            <section class="grid main-sorting">

                <div class="cursor-pointer">
                    <img src="../../assets/img/actions-main-cmp/Primary.png" />
                    <span>Primary</span>
                </div>

                <div class="cursor-pointer">
                    <img src="../../assets/img/actions-main-cmp/promotion.png" />
                    <span>Promotions</span>
                </div>

                <div class="cursor-pointer">
                    <img src="../../assets/img/actions-main-cmp/social.png" />
                    <span>Social</span>
                </div>

                <div class="cursor-pointer">
                   <img src="../../assets/img/actions-main-cmp/update.png" />
                    <span>Updates</span>
                </div>
            </section>

            <mail-prev/>
            <section class="mail-app" v-if="mails">
        <mail-list
            @changeUrlImgeIndicate="changeUrlImgeIndicate"
            @selected="selectMail" 
            @remove="removeMail" 
            @snooze="snooze"
            :mails="mailsToShow"/>
         </section>


    
            <!-- TODO: DIV , DIV -->
            <!-- <div class="sort-subject">sort-subject</div> -->
            <!-- <div class="mails-list">mails-list</div> -->

        </main>
    </section>


 
    `,
    data() {
        return {
            mails: null,
            filterBy: {},
            mark: false,
            timeOfSnoozed: null
        }
    },
    created() {
        this.load()
        eventBus.on('scheduleMsg', this.scheduleMsg)
    },
    methods: {

        snooze(mailId) {
            // console.log(mailId)
            this.timeOfSnoozed = +prompt('enter time of snooze (seconds)') * 1000
            storageService.get('mails', mailId)
                .then((mail) => {
                    mail.isSnoozed = true
                    return mail
                })
                // TODO: refactor to this function...not duplicate of code....
                .then((mail) => {
                    mailService.save(mail)
                    setTimeout(() => {
                        this.$router.push('/mail/snooze')
                    }, 10)
                    setTimeout(() => {
                        this.$router.push('/mail')
                    }, 10)
                    return mail
                })

                .then((mail) => {
                    setTimeout(() => {
                        storageService.get('mails', mailId)
                            .then((mail) => {
                                mail.isSnoozed = false
                                return mail
                            })
                            .then((mail) => {
                                mailService.save(mail)
                                setTimeout(() => {
                                    this.$router.push('/mail/snooze')
                                }, 10)
                                setTimeout(() => {
                                    this.$router.push('/mail')
                                }, 10)
                                return mail
                            })
                    }, this.timeOfSnoozed);
                })
        },
        scheduleMsg(time) {
            setTimeout(() => {
                console.log('wowoowo')
                this.load()
                // .then
            }, time);
        },

        load() {
            mailService.query()
                .then((mails) => {
                    this.mails = mails
                    return mails
                })
        },
        print() {
            console.log('print')
        },
        removeMail(mailId) {
            mailService.remove(mailId)
                .then(() => {
                    const idx = this.mails.findIndex(mail => mail.id === mailId)
                    this.mails.splice(idx, 1)

                    const msg = {
                        txt: `Mail ${mailId} deleted...`,
                        type: 'success',
                    }
                    eventBus.emit('user-msg', msg)
                })
        },
        selectMail(mail) {
            this.selectedMail = mail
        },
        mailSaved(mail) {
            this.mails.push(mail)
        },
        filter(filterBy) {
            console.log(filterBy)
            this.filterBy = filterBy
        },
        changeUrlImgeIndicate() {
            this.load()
        },
        removeSelected() {
            mailService.query()
                .then(mails => {
                    var m = mails.filter(mail => !mail.isSelected)
                    return m
                })
                .then((m) => {
                    localStorage.setItem('mails', JSON.stringify(m))
                    // console.log(m)
                    this.load()
                    // this.mark = !this.mark
                    return Promise.resolve()

                })
        }
    },
    computed: {



        mailsToShow() {
            const regex = new RegExp(this.filterBy.title, 'i')
            // mails = this.mails.filter(mail => regex.test(mail.title))
            // console.log(mails, '***mails a***')

            var mails = this.mails.filter(mail => (mail.isReceived) && regex.test(mail.title))
            // console.log(mails, '***mails b***')


            // console.log(mails, '***mails***')
            // mails = this.mails.filter(mail => (!mail.isDraft))
            //  console.log(mails,'FILTERED')



            // if (!this.filterByObj) {
            // mails = this.mails.filter(mail => (!mail.isDraft))
            // mails = this.mails.filter(mail => (!mail.isSent))
            // }

            // console.log('*** mails ***', mails);
            // console.log(this.filterByObj, ';;;;')

            if (this.filterByObj) {
                // console.log(mails,'FILTERED IF')
                if (this.filterByObj.byStar) {
                    mails = this.mails.filter(mail => (mail.isStarred))
                }

                if (this.filterByObj.bySent) {
                    mails = this.mails.filter(mail => (mail.isSent))
                }

                if (this.filterByObj.byDraft) {
                    mails = this.mails.filter(mail => (mail.isDraft))
                }
                if (this.filterByObj.bySchedule) {
                    mails = this.mails.filter(mail => (mail.isSchedule))
                }
                if (this.filterByObj.bySnooze) {
                    mails = this.mails.filter(mail => (mail.isSnoozed))
                }
            }

            // else {
            //     console.log('else ^^^')
            //     console.log(this.filterByObj, ';;;;')
            //     mails = this.mails.filter(mail => (!mail.isSent))
            //     mails = this.mails.filter(mail => (!mail.isDraft))

            // }

            // console.log('*** mails *** part 2 ***', mails);
            // console.log(mails, '***mails B***')

            return mails
        },
        deleteMainStyle() {
            return { mark: this.mark }

        },
        mailId() {
            // const id = this.$route.params.id

            return this.$route.fullPath
        }


    },
    watch: {
        mailId() {
            console.log('changed')
            this.load()

        }
    }
    ,
    components: {
        mailFilter,
        mailList,
        mailPrev,
        leftHeader,
        navBar,
        rightHeader
    }
}