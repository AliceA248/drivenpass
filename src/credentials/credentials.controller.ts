import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { JWTPayload } from '../users/auth/auth.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Credentials')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new credential for the user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Credential created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data. Please check the request body.',
  })
  create(
    @Body() createCredentialDto: CreateCredentialDto,
    @User() user: JWTPayload,
  ) {
    const credential = this.credentialsService.create(createCredentialDto, user);
    return this.formatResponse(credential);
  }

  @Get()
  @ApiOperation({ summary: 'Get credentials by userId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all credentials for the user.',
  })
  findAll(@User('id') id: number) {
    const credentials = this.credentialsService.findAll(id);
    return this.formatResponse(credentials);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one credential by credentialId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the credential with the specified id.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found. Please verify the credential id.',
  })
  findOne(
    @Param('id', ParseIntPipe) paramId: number,
    @User('id') userId: number,
  ) {
    const credential = this.credentialsService.findOne(paramId, userId);
    if (!credential) {
      throw new NotFoundException('Credential not found');
    }
    return this.formatResponse(credential);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete one credential by credentialId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Credential deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credential not found. Please verify the credential id.',
  })
  remove(
    @Param('id', ParseIntPipe) paramId: number,
    @User('id') userId: number,
  ) {
    const credential = this.credentialsService.findOne(paramId, userId);
    if (!credential) {
      throw new NotFoundException('Credential not found');
    }
    this.credentialsService.remove(paramId, userId);
  }

  private formatResponse(data: any) {
    return {
      data,
    };
  }
}
