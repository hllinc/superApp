import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {ActionSheetController, NavController} from "ionic-angular";
import {TongxinProvider} from "../../providers/tongxin";
import {NativeProvider} from "../../providers/native";
import {ValidateProvider} from "../../providers/validate";
import {PopProvider} from "../../providers/pop";
import {PublishProvider} from "../../providers/publish";
import {UtilsProvider} from "../../providers/utils/utils";

/**
 * Generated class for the AddCommentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'add-comment',
    templateUrl: 'add-comment.html'
})
export class AddCommentComponent implements OnChanges{

    private showStatus: boolean = false;
    private commentData: object = {};
    public pictures: Array<string> = [];
    public commentInfo = {
        content:"",
        thumb:"",
        zid:0
    };
    constructor(public TongXin: TongxinProvider,
                public native: NativeProvider,
                public navCtrl:NavController,
                public actionSheetCtrl: ActionSheetController,
                public Validate:ValidateProvider,
                public Pop:PopProvider,
                public Publish:PublishProvider,
                public Utils:UtilsProvider) {
        this.subComment();
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.subComment();
    }

    // 订阅添加评论输入框显示状态
    public subComment() {
        this.TongXin.obComment.subscribe(res => {
            this.showStatus = res.showStatus;
            this.commentInfo.zid = res.commentData.id;
            this.commentData = res.commentData;
           this.Utils.toggleTabs(this.showStatus);
        });
    }

    // 添加评论图片
    public addPicture() {
        let actionSheet = this.actionSheetCtrl.create({
            title: '请选择头像',
            buttons: [
                {
                    text: '相机',
                    role: 'destructive',
                    handler: () => {
                        this.native.getPictureByCamera().subscribe(picUrl => {
                            // this.commentData['comment'][0]['pictures'].push(picUrl);
                            this.commentInfo.thumb = picUrl;
                        })
                    }
                }, {
                    text: '图库',
                    handler: () => {
                        this.native.getPictureByPhotoLibrary().subscribe(picUrl => {
                            // let oldPics = this.commentData['comment'][0]['pictures'];
                            // oldPics.push.apply(oldPics,picUrl);
                            console.log(picUrl)
                            this.commentInfo.thumb = picUrl;
                        })
                    }
                }, {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                        console.log('选择头像已取消');
                    }
                }
            ]
        });
        actionSheet.present();
    }
    // 发送圈子评论
    public sendComment(){
        this.Publish.sendComment(this.commentInfo).subscribe(res=>{
            if(res !== false){
                this.showStatus = false;
                this.commentData['talk_list'].unshift(res.data);
                this.Utils.toggleTabs(this.showStatus);
                this.Pop.toast(res.message);
            }
        });
    }

}
