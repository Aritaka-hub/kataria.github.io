# 概要

Raspberry Pi Zero（以降、PiZero）の Node.js から Web GPIO API と Web I2C API を扱う方法です。公式の OS イメージに環境を構築していきます。



# 準備

PiZero の環境を、本体にディスプレイやキーボード接続をしないで設定していきます。
OS は、Raspberry Pi OS Lite （CUI版）を使用します。
OS の導入には、公式TOOL の [Raspberry Pi Imager](https://www.raspberrypi.org/software/) を使用します。

Image の書き込みが完了すると、自動的にアンマウントされるので、再度 microSD を挿入し直します。
boot フォルダ内にファイル名 `ssh` という空ファイルと、無線設定を記述した `wpa_supplicant.conf` をコピーします。

`wpa_supplicant.conf` は以下の内容で記述します。
※ [] 内は自身の環境に合わせて記述を変更してください。

```
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=JP
network={
   ssid=" [ルータの名前] "
   psk=" [パスワード] "
}
```

Wi-Fi設定を[ブラウザから設定するツール](https://qiita.com/mascii/items/a43d71572e1919e56398) も公開されています。

このファイルを boot に入れておくと、起動時に自動的に ssh と 無線LAN を有効化します。
これ以降の操作は ssh を使い遠隔で進めていきます。



# PiZeroをUSB接続（OTG Serial 接続）出来るようにする

無線LAN を使用しないで、USB接続で PiZero の操作ができるようにします。今回の設定は SSH を使用する事を前提に記載しますが、モニターやキーボードを接続して設定することも可能です。

ここの設定は SSH で操作できる環境では必須ではありませんが、Wi-Fi 等の無線環境がないところに PiZero を設置した場合にも、PC と USB接続で操作が可能になるので設定推奨です。

`sudo editor /boot/config.txt` と入力して設定ファイルを編集します。
末尾に `dtoverlay=dwc2` を追記

`sudo editor /boot/cmdline.txt` と入力して設定ファイルを編集します。
rootwait の後に `modules-load=dwc2,g_serial` を追記

次のコマンドを入力してシンボリックリンクを張ります。
```
cd /etc/systemd/system/getty.target.wants
sudo ln -s /lib/systemd/system/getty@.service getty@ttyGS0.service
```

以上の３つの設定をしたら、PC と PiZero を USB接続できるようになります。USBケーブルはデータ通信が出来るものを使用し、[PiZero の USBポート（電源ポートではない方）](https://raspberry-pi.ksyic.com/page/page/pgp.id/19)に接続します。

[Web Serial RPiZero Terminal](https://svg2.mbsrv.net/chirimen/webSerial_piZero/testRt4.html) を使用すると、ブラウザから USB接続で SSH と同様にコマンド操作することが可能です。

※ 備考
OTG 接続には２種類あり、[OTG Ether モード](https://qiita.com/Liesegang/items/dcdc669f80d1bf721c21) を利用した方法もあります。
詳しくは、[PiZero を USB OTG 接続](https://github.com/webdino/pizero-workshop/blob/20190528/docs/Setup.md) を参照すれば設定することが出来ます。




# PiZero に Node.js をインストールする

PiZero に積まれている ARMv6 は古いチップになります。これに対応する Node.js は v10（v11）までが公式の提供バージョンとなります。また [NodeSource を使ったインストール方法](https://github.com/nodesource/distributions#installation-instructions) には対応していません。
導入するには手動でインストールをする必要があります。

公式の提供する Node.js v10 は[サポート期限が 2021年4月30日](https://nodejs.org/ja/about/releases/) までとなっていますので、今回は非公式版の Node.js v14 Armv6対応版 を使用します。
非公式版の情報は こちら（ [unofficial Node.js](https://unofficial-builds.nodejs.org/download/release/) ）を参照してください。

リリース情報（[公式](https://nodejs.org/ja/download/)、[非公式](https://unofficial-builds.nodejs.org/download/release/) ）より、バージョン確認をします。
ターミナルを起動して以下のコマンドを実行します。
※2021年7月20日の状況で書いております。

```
VERSION=v14.17.3
DISTRO=linux-armv6l
wget https://unofficial-builds.nodejs.org/download/release/$VERSION/node-$VERSION-$DISTRO.tar.xz
```

ダウンロードが終わったら解凍して導入していきます。

```
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
```

~/.profile に追記を行います。

```
# Nodejs
VERSION=v14.17.3
DISTRO=linux-armv6l
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH
```

.profileの再読み込み

```
. ~/.profile
```

以上で導入は完了です。
バージョンをチェックして確認をしてください。

```
$ node -v
v14.17.3
$ npm -v
6.14.13
$ npx -v
6.14.13
```

参照: [Installation · nodejs/help Wiki · GitHub](https://github.com/nodejs/help/wiki/Installation)



# Web GPIO API と Web I2C API を PiZero に導入する

[CHIRIMEN チュートリアル の 新しいディレクトリの作成](https://tutorial.chirimen.org/raspi/nodejs) 以下の内容を実施しています。
以降は大きな変更点は無く実行することが出来ました。

プログラムを実行するための環境を整えます。
作業用のディレクトリを作り、そのディレクトリの中でプログラムを実行します。

ssh を使用して以下のコマンドを入力します。

```
mkdir hello-real-world
cd hello-real-world
```

npm のためのファイル package.json を作成します。

```
npm init -y
```

作業用のディレクトリの中に npm パッケージ [node-web-gpio](https://www.npmjs.com/package/node-web-gpio) と [node-web-i2c](https://www.npmjs.com/package/node-web-i2c) をインストールします。

```
npm install node-web-gpio node-web-i2c
```

これで Node.js から WebGPIO API と WebI2C API を使う準備は完了です。



以上となります。

