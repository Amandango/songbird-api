"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const texts_1 = require("../models/texts");
const texts_repository_1 = require("../repositories/texts.repository");
const jsonwebtoken_1 = require("jsonwebtoken");
const { readFileSync } = require('fs');
const { join, extname } = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('src/config.json');
let TextController = class TextController {
    constructor(textsRepo) {
        this.textsRepo = textsRepo;
    }
    async postTextMoment(textMoment) {
        return await this.textsRepo.create(textMoment);
    }
    async getTextsById(jwt) {
        if (!jwt)
            throw new rest_1.HttpErrors.Unauthorized('JWT token is required');
        try {
            var jwtBody = jsonwebtoken_1.verify(jwt, 'encryption');
            console.log(jwtBody);
            var allTexts = await this.textsRepo.find({ where: { userId: jwtBody.id } });
            return allTexts;
        }
        catch (err) {
            throw new rest_1.HttpErrors.BadRequest('JWT token invalid');
        }
    }
    async postVoiceRecordingsById(voiceRecording) {
        console.log('trying to work');
        var s3 = new AWS.S3();
        var bucketParams = { Bucket: 'songbird-bucket' };
        s3.createBucket(bucketParams);
        // s3 = new AWS.S3({ params: { Bucket: 'songbird-bucket' } })
        var data = { Key: 'recordingFile', Body: voiceRecording };
        s3.putObject(data, function (err, data) {
            if (err) {
                console.log('Error uploading data: ', data);
            }
            else {
                console.log('succesfully uploaded the image!');
            }
        });
    }
};
__decorate([
    rest_1.post('/texts'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [texts_1.Texts]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "postTextMoment", null);
__decorate([
    rest_1.get('/getTextsById'),
    __param(0, rest_1.param.query.string('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "getTextsById", null);
__decorate([
    rest_1.post('/postVoiceRecordings'),
    __param(0, rest_1.requestBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TextController.prototype, "postVoiceRecordingsById", null);
TextController = __decorate([
    __param(0, repository_1.repository(texts_repository_1.TextsRepository.name)),
    __metadata("design:paramtypes", [texts_repository_1.TextsRepository])
], TextController);
exports.TextController = TextController;
//# sourceMappingURL=text.controller.js.map