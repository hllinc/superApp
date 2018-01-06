import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NavController} from "ionic-angular";
import {HttpProvider} from "../../providers/http";
import {PopProvider} from "../../providers/pop";
import {PublishProvider} from "../../providers/publish";
import {ValidateProvider} from "../../providers/validate";
import {TongxinProvider} from "../../providers/tongxin";
import {GoodsProvider} from "../../providers/goods";

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
    selector: 'header',
    templateUrl: 'header.html'
})
export class HeaderComponent implements OnChanges {
    @Input() headerTitle: string;
    @Input() save: string;
    @Input() addAddress: string;
    @Input() addressInfo:object = {};
    @Input() publish;
    public pubData: any = {};
    public cityArr:Array<string> = [];
    constructor(public navCtrl: NavController,
                public Http: HttpProvider,
                public Pop: PopProvider,
                public Publish: PublishProvider,
                public Validate: ValidateProvider,
                public TongXin: TongxinProvider,
                public Goods:GoodsProvider) {
        console.log('Hello HeaderComponent Component');
        this.getContent();
    }
    // 监听更新发布内容的变化
    ngOnChanges(changes: SimpleChanges) {

    }
    // 圈子发布内容
    public getContent(){
        this.TongXin.obCircle.subscribe(res => {
            console.log(res)
            this.pubData = res;
        });
    }
    // 跳转至新增收货地址页面
    public newAddress() {
        this.navCtrl.push("AddressAddPage");
    }

    // 保存新增或编辑地址页面信息
    public saveAddress() {
        let cityArr = document.getElementById("cities").innerText;
        let name = this.Validate.trimBlank(this.addressInfo['name']);
        let mobile = this.Validate.trimBlank(this.addressInfo['mobile']) && this.Validate.phone(this.addressInfo['mobile']);
        let address = this.Validate.trimBlank(this.addressInfo['area']);
        cityArr = this.Validate.trimBlank(cityArr);
        if(!name){
            this.Pop.toast("请填写收件人姓名");
            return false;
        }
        if(!mobile){
            this.Pop.toast("请填写正确的收件人手机号");
            return false;
        }

        if(cityArr == '省-市-区(县)'){
            this.Pop.toast("请选择所在地区");
            return false;
        }
        if(!address){
            this.Pop.toast("请填写收件人详细地址信息");
            return false;
        }
        this.cityArr = cityArr.split("-");
        this.addressInfo['province']  = this.cityArr[0];
        this.addressInfo['city']  = this.cityArr[1];
        this.addressInfo['district']  = this.cityArr[2];
        if(this.addressInfo['type'] === 'add'){
            this.Goods.addNewAddress(this.addressInfo).subscribe(res =>{
                if(res === "toLogin"){
                    this.navCtrl.push("LoginPage");
                    return false;
                }
                this.Pop.toast(res.message);
                this.navCtrl.pop();
            });
        }else{
            this.Goods.editSaveAddress(this.addressInfo).subscribe(res =>{
                if(res === "toLogin"){
                    this.navCtrl.push("LoginPage");
                    return false;
                }
                this.Pop.toast(res.message);
                this.navCtrl.pop();
            });
        }
        console.log(this.addressInfo);
        // this.navCtrl.pop();
    }

    //发表圈子
    public pushCircle() {
        let formData = new FormData();
        let content = this.pubData['content'];
        let src = this.pubData['src'];
        console.log(this.pubData)
        if (!this.Validate.trimBlank(content)) {
            this.Pop.toast("发布内容不能为空！");
            return false;
        }
        if (!this.Validate.trimBlank(src)) {
            this.Pop.toast("请上传发布图片或视频！");
            return false;
        }

        this.Http.getToken().subscribe(res => {

            if (res === false) {
                this.navCtrl.push("LoginPage");
                return false;
            } else {
                // this.pubData['token'] = res;
                formData.append("op","push_circle");
                formData.append("token",res);
                formData.append("content",content);
                formData.append("src",src);
                this.Publish.pubCircle(formData).subscribe(res => {
                    this.Pop.toast(res.msg);
                    if (res.code == 0) {
                        this.navCtrl.pop();
                    } else if (res.code == -1) {
                        this.Pop.confirm().subscribe(res => {
                            if (res === false) {
                                this.navCtrl.push("LoginPage");
                            }
                        });
                    } else {
                        this.Pop.toast(res.msg);
                    }
                });
            }
        });

    }
}
