const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Eleccion", function (){

    let owner, user2, user3;

    beforeEach(async function(){
        [owner, user2, user3] = await ethers.getSigners();
        //contrato que hace referencia
        const Election = await ethers.getContractFactory("Election", owner);
        //intancia con dato para constructos
        this.election = await Election.deploy();
        
    })

    describe("Only owner", function () {

        it("Solo el owner puede agregar un candidato", async function () {
            expect(await this.election.connect(owner).addCandidate("Macri"));
            await expect(this.election.connect(user2).addCandidate("Massa")).to.be.reverted;
        });

        it("Solo el owner puede iniciar la eleccion", async function () {
            expect(await this.election.connect(owner).timeElection());
            await expect(this.election.connect(user2).timeElection()).to.be.reverted;
        });

        it("Solo el owner puede tranferir el token NTT", async function () {        
            expect(await this.election.connect(owner).transfer(user2.address, 1));
            expect(await this.election.connect(user2).balanceOf(user2.address)).to.be.eq(1);
            await expect(this.election.connect(user2).transfer(user3.address, 1)).to.be.reverted;
            expect(await this.election.connect(user3).balanceOf(user3.address)).to.be.eq(0);
        });

        it("El owner recibe el total supply", async function () {
            expect(await this.election.connect(owner).balanceOf(owner.address)).to.be.eq(45000000);
        });
    })

    describe("Tiempos marcados de eleccion", function (){
        
        it("Solo se permite votar una vez arrancada la funcion 'TimeElection'", async function (){
            expect(await this.election.connect(owner).transfer(user2.address, 10));
            expect(await this.election.connect(owner).transfer(user3.address, 1));
            expect(await this.election.connect(owner).addCandidate("Candidato1"));
            expect(await this.election.connect(owner).addCandidate("Candidato2"));
            expect(this.election.connect(user2).vote(1)).to.be.revertedWith('La votacion no ah comenzado/ ah terminado');
            expect(await this.election.connect(owner).timeElection());
            expect(await this.election.connect(user2).vote(1));
            expect(this.election.connect(user2).vote(1)).to.be.revertedWith('Solo es posible votar una vez');
            expect(await this.election.connect(user3).vote(1));
            console.log(await this.election.connect(user3).seeVotes(1));
            console.log(await this.election.connect(user3).seeVotes(2));
        });
    });
});
