import { describe, it, expect, vi } from 'vitest';
import { AppConfigurator } from '../AppConfigurator';
import type { BaseColors, ConfigurationResponse } from '../types';
import type { Writer } from '../../writers/types';
import type { Logger } from '../../logs/types';

describe('AppConfigurator', () => {
    let writerMock: Writer;
    let loggerMock: Logger;

    beforeEach(() => {
        writerMock = {
            write: vi.fn(),
            writeMissing: vi.fn()
        };
        loggerMock = {
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn()
        };
    });
    describe('generate SCSS variables', () => {        
        it('should generate SCSS variables for a Tailwind palette from a primary and a secondary color', () => {
            const configurator = new AppConfigurator(writerMock, loggerMock);
            const writerSpy = vi.spyOn(writerMock, 'write');
            const loggerSpy = vi.spyOn(loggerMock, 'info');
            const colors: BaseColors = {
                primary: '#22C55E',
                secondary: '#2522FC',
            };
            
            const EXPECTED = 
`$color-2-primary-50: 233 251 240;
$color-2-primary-100: 207 247 222;
$color-2-primary-200: 159 239 188;
$color-2-primary-300: 111 230 155;
$color-2-primary-400: 64 222 122;
$color-2-primary-500: 34 197 94;
$color-2-primary-600: 27 157 75;
$color-2-primary-700: 20 117 56;
$color-2-primary-800: 13 78 37;
$color-2-primary-900: 7 39 19;

$color-2-secondary-50: 235 235 255;
$color-2-secondary-100: 210 210 254;
$color-2-secondary-200: 166 164 254;
$color-2-secondary-300: 126 124 253;
$color-2-secondary-400: 82 79 253;
$color-2-secondary-500: 37 34 252;
$color-2-secondary-600: 7 3 226;
$color-2-secondary-700: 5 2 171;
$color-2-secondary-800: 3 2 111;
$color-2-secondary-900: 2 1 55;
`;
            
            const scssContent = configurator.generateScssVariables(colors);
            
            expect(scssContent).toBe(EXPECTED);
            expect(loggerSpy).toHaveBeenCalledOnce();
            expect(writerSpy).toHaveBeenCalledOnce();
            expect(writerSpy).toHaveBeenCalledWith(EXPECTED, expect.any(String));
        });
    });
    
    describe('generate environment configuration', () => {
        beforeEach(() => {
            vi.resetModules();
            process.env.FETCH_REMOTE_CONFIG = 'true';
            process.env.API_URL = 'https://api.example.com'
            process.env.API_ENDPOINT = 'https://api.example.com';
            process.env.API_SECURITY_TOKEN = 'securetoken';
            process.env.CONFIG_ID = '1';
        });
        
        afterEach(() => {
            delete process.env.FETCH_REMOTE_CONFIG;
            delete process.env.API_URL;
            delete process.env.API_ENDPOINT;
            delete process.env.API_SECURITY_TOKEN;
            delete process.env.CONFIG_ID;
        });
        
        it('should generate environment file content with valid environment variables', () => {
            const configurator = new AppConfigurator(writerMock, loggerMock);
            const loggerSpy = vi.spyOn(loggerMock, 'info');
            const writerSpy = vi.spyOn(writerMock, 'write');
            const data: ConfigurationResponse = {
                category1: [
                    {
                        key: 'key1',
                        value: 'value1',
                        configId: 0,
                        categoryId: 0,
                        labelKey: [],
                        type: '',
                        possibleValues: [],
                        defaultValue: null
                    },
                    {
                        key: 'key2',
                        value: 'value2',
                        configId: 0,
                        categoryId: 0,
                        labelKey: [],
                        type: '',
                        possibleValues: [],
                        defaultValue: null
                    },
                ],
            };
            
            const EXPECTED = 
`FETCH_REMOTE_CONFIG=true
API_URL=https://api.example.com
API_ENDPOINT=https://api.example.com
API_SECURITY_TOKEN=securetoken
CONFIG_ID=1
KEY1="value1"
KEY2="value2"
`;
            
            const environmentContent = configurator.generateEnvironment(data);
            
            expect(environmentContent).toBe(EXPECTED);
            expect(loggerSpy).toHaveBeenCalledOnce();
            expect(writerSpy).toHaveBeenCalledOnce();
            expect(writerSpy).toHaveBeenCalledWith(EXPECTED, expect.any(String));
        });
        
        it('should not generate environment file content with missing environment variables', () => {
            delete process.env.API_SECURITY_TOKEN;
            
            const configurator = new AppConfigurator(writerMock, loggerMock);
            const loggerSpy = vi.spyOn(loggerMock, 'info');
            const writerSpy = vi.spyOn(writerMock, 'write');
            const data: ConfigurationResponse = {
                category1: [
                    {
                        key: 'key1',
                        value: 'value1',
                        configId: 0,
                        categoryId: 0,
                        labelKey: [],
                        type: '',
                        possibleValues: [],
                        defaultValue: null
                    },
                    {
                        key: 'key2',
                        value: 'value2',
                        configId: 0,
                        categoryId: 0,
                        labelKey: [],
                        type: '',
                        possibleValues: [],
                        defaultValue: null
                    },
                ],
            };
            
            const environmentContent = configurator.generateEnvironment(data);
            
            expect(environmentContent).toBe('');
            expect(loggerSpy).not.toHaveBeenCalled();
            expect(writerSpy).not.toHaveBeenCalled();
        });
    });

    describe('generate language files', () => {
        it('should generate language files for the given language list', () => {
            const configurator = new AppConfigurator(writerMock, loggerMock);
            const writerSpy = vi.spyOn(writerMock, 'writeMissing');
            const loggerSpy = vi.spyOn(loggerMock, 'info');
            const languages = {
                default: 'en',
                activated: 'en,de',
            }

            configurator.generateLanguageFiles(languages);
            expect(loggerSpy).toHaveBeenCalledOnce();
            expect(writerSpy).toHaveBeenCalledTimes(3);
        });
    });
});