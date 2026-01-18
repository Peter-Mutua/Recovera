import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PlanService } from '../services/plan.service';
import { CreatePlanDto, UpdatePlanDto } from '../dto/plan.dto';

@Controller('admin/plans')
export class PlanController {
    constructor(private planService: PlanService) { }

    @Post()
    create(@Body() createPlanDto: CreatePlanDto) {
        return this.planService.create(createPlanDto);
    }

    @Get()
    findAll() {
        return this.planService.findAll();
    }

    @Get('active')
    findActive() {
        return this.planService.findActive();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.planService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
        return this.planService.update(id, updatePlanDto);
    }

    @Put(':id/toggle')
    toggleActive(@Param('id') id: string) {
        return this.planService.toggleActive(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.planService.remove(id);
    }
}

// Public endpoint for mobile app to fetch plans
@Controller('plans')
export class PublicPlanController {
    constructor(private planService: PlanService) { }

    @Get()
    findActive() {
        return this.planService.findActive();
    }

    @Get(':code')
    findByCode(@Param('code') code: string) {
        return this.planService.findByCode(code);
    }
}
